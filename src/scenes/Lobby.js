import { Draw, Server } from '../imports.js'
import { Game } from '../systems/Game.js'
import { Scene } from '../modules/Scene.js'
import { Battle, Disconnected } from '../modules/Scenes.js'

const playersPerTeam = 2
export class Lobby extends Scene {
  constructor (name, playerClass) {
    super()

    this.player = [name, playerClass]
  }
  start() {
    this.players = []

    Draw.clear()
    Server.connect()

    Server.on('disconnect', () => {
      Game.setupScene(new Disconnected)
    })
    
    Server.on('connect', () => {
      Server.emit('hello', ...this.player)
    })

    Server.on('prepare', (m, a) => {
      this.players.push(...JSON.parse(a), this.player)
      this.playerId = this.players.length
    })

    Server.on('hello', (nam, cla) => {
      this.players.push([nam, cla])
    })

    Server.on('start', () => {
      Game.setupScene(new Battle(this.players, this.playerId))
    })
  }

  update() {
    Draw.clear()

    const x = 120, y = 100, r = 30
    
    this.players.forEach((player, i) => {
      const e = Game.classes.filter(e => e.name === player[1]).pop()
      
      Draw.text(x + i * 120, y + i%2 * 120 - r - 10, e.color, '14px Impact', 'center', player[0])
      Draw.circle(x + i * 120, y + i%2 * 120, r, e.color )
      Draw.text(x + i * 120, y + i%2 * 120 + r + 20, e.color, '14px Impact', 'center', e.name)
    })

    const left = playersPerTeam * 2 - this.players.length
    
    if (left > 0)
      Draw.text(50, 340, '#ccc', '14px Impact', 'left',
        'Waiting for ' + left + ' player' + (left > 1 ? 's' : ''))
    else 
      Draw.text(50, 340, '#ccc', '18px Impact', 'left', 'Prepare!')
  }

  destroy() {
    Server.off()
  }
}