const fs = require('fs')
const express = require('express')
const session = require('express-session')
const parser = require('body-parser')
const storage = require('./lib/storage')
const http = require('http')
const socket = require('socket.io')

function createSandbox() {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    storage: storage.interface
  }

  Object.defineProperty(sandbox, 'module', {
    enumerable: true,
    configurable: false,
    writable: false,
    value: Object.create(null)
  })
  sandbox.module.exports = Object.create(null)
  sandbox.exports = sandbox.module.exports
  return sandbox
}

let httpServer = false

function start() {
  const app = express()
  const server = http.Server(app)
  const io = socket(server)
  const code = fs.readFileSync('./src/server.js', 'utf8')
  const shared = fs.readFileSync('./src/shared.js', 'utf8')

  app.set('port', (process.env.PORT || 8080))
    .set('storage', process.env.DATABASE_URL || 'sqlite:storage.sqlite')
    .get('/server-info', (req, res) => {
      let limit = 13312,
          storageSize = storage.interface.size()
      res.set('Content-Type', 'text/plain').send([
        `Storage: ${storageSize} byte / ${(storageSize ? storageSize / limit * 100 : 0).toFixed(2)}%`
      ].join('\n'))
    })
    .use(express.static('src'))
    .use('/assembly', express.static('assembly'))
    .use(session({ secret: 'js13kserver', saveUninitialized: false, resave: false }))

  storage.init(app.get('storage')).then(() => {
    const sandbox = createSandbox()
    require('vm').runInNewContext(shared + '\n' + code, sandbox)
    if (typeof sandbox.module.exports == 'function') {
      io.on('connection', sandbox.module.exports)
    } else if (typeof sandbox.module.exports == 'object') {
      app.use(parser.urlencoded({ extended: true }))
        .use(parser.json())
      for (let route in sandbox.module.exports)
        if (route == 'io')
          io.on('connection', sandbox.module.exports[route])
        else
          app.all('/' + route, sandbox.module.exports[route])
    }
    httpServer = server.listen(app.get('port'), () => {
      console.log('Server started at port: ' + app.get('port'))
    })
  }).catch(err => {
    console.error(err)
  })
}

const TIMEOUT = 500
function watcher(f, lock = false) {
  return () => {
    if (!lock) {
      lock = true
      f()
      setTimeout(() => lock = false, TIMEOUT)
    }
  }
}

fs.watch('src/server.js', watcher(() => httpServer.close(start)))
fs.watch('src/shared.js', watcher(() => httpServer.close(start)))

start()
