const rollup = require('rollup')

new Promise(r => r(rollup.rollup))
.then(rollup => rollup({
  input: './src/index.js',
  plugins: [
    require('rollup-plugin-terser').terser({
      ecma: 8,
      module: true,
      sourcemap: false,
      toplevel: true,
      keep_classnames: false,
      mangle: {
        module: true,
        properties: {
          builtins: false,
          debug: false,
          keep_quoted: true
        }
      },
      compress: {
        ecma: 6,
        module: true,
        drop_console: true
      },
      output: {
        // beautify: true
      }
    })
  ]
}))
.then(bundle => bundle.write({
  format: 'esm',
  file: './public/index.js'
}))
.then(() => rollup.rollup)
.then(rollup => rollup({
  input: './src/server.js',
  plugins: [
    require('rollup-plugin-terser').terser({
      sourcemap: false,
      compress: {
        drop_console: true
      },
      output: {
        // beautify: true
      }
    })
  ]
}))
.then(bundle => bundle.write({
  format: 'esm',
  file: './public/server.js'
}))
.then(() => {
  const output = require('fs').createWriteStream(__dirname + '/dist.zip')
  const archive = require('archiver')('zip', {
    zlib: { level: 9 }
  })

  output.on('close', () => {
    console.log(archive.pointer() / 1024 + 'kb')
  })

  archive.pipe(output)
  archive.directory('public/', false)
  archive.finalize()
})
.catch(e => console.error(e))
