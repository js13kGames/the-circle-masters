import { Draw, Server } from '../imports.js'

import { Game } from '../systems/Game.js'
import { Mouse } from '../systems/Mouse.js'
import { Keyboard } from '../systems/Keyboard.js'

import { Scene } from '../modules/Scene.js'
import { Camera } from '../modules/Camera.js'
import { Physics } from '../modules/Physics.js'
import { Entity } from '../modules/Entity.js'
import { Board } from '../modules/Board.js'
import { Vector } from '../modules/Vector.js'

import * as Components from '../modules/Components.js'

import { Disconnected, End } from '../modules/Scenes.js'

export class Battle extends Scene {
  constructor(players, id) {
    super()

    this.playerId = id - 1
    this.players = players
  }

  start() {
    this.camera = this.playerId % 2 ? new Camera(-300, -285) : new Camera(350, 350)
    this.physics = new Physics

    this.time = /* 5 * */ 60 * 100 + 99

    if (this.playerId % 2) {

      this.playerBase = this.createBase(-270, -270, 1)
      this.enemyBase = this.createBase(870, 570, 0)

    } else {

      this.playerBase = this.createBase(870, 570, 1)
      this.enemyBase = this.createBase(-270, -270, 0)

    }

    this.board = new Board().add([
      ...this.players.map((e, i) => this.createHero(e, i)),
      ...this.generateBorders(),
      this.playerBase,
      this.enemyBase
    ])

    Mouse.onMove = v => {
      this.camera.position = Vector.sub(this.camera.position, v)
    }

    Mouse.onClick = v => {
      if (v.x >= 280 && v.x <= 280 + 18 && v.y >= 337 && v.y <= 337 + 18 ) {
        this.superPower('off')
      // } else if (v.x >= 300 && v.x <= 300 + 18 && v.y >= 337 && v.y <= 337 + 18 ) {
      //   this.superPower('1')
      // } else if (v.x >= 320 && v.x <= 320 + 18 && v.y >= 337 && v.y <= 337 + 18 ) {
      //   this.superPower('2')
      } else if (v.x >= 342 && v.x <= 342 + 18 && v.y >= 337 && v.y <= 337 + 18 ) {
        this.superPower('center')
      } else {
        const dest = Vector.sub(v, this.camera.position)
        Server.emit('target', dest.x, dest.y)
      }
    }

    Keyboard.onDown = k => {
      if (k === 49) this.superPower('off')
      else if (k === 50) this.superPower('1')
      else if (k === 51) this.superPower('2')
      else if (k === 67) this.superPower('center')
    }

    Server.on('target', (id, x, y) => {
      [...this.board.values()][id].components.get(Components.Destination.name)
        .setDestination(new Vector(x, y))
    })

    Server.on('power', (id, n) => {
      this.power(id, n)
    })

    Server.on('disconnect', () => {
      Game.setupScene(new Disconnected)
    })
    
    Server.on('end', id => {
      Server.disconnect()
      this.nextScene(id)
    })
  }

  createHero(e, i) {
    let x = i % 2 ? 800 : -200, y = i % 2 ? 500 : -200

    if (i > 1) {
      x -= 20
      y += 20
    } else {
      x += 20
      y -= 20
    }
    const heroClass = Game.classes.filter(c => c.name === e[1]).pop()
    const hero = new Entity
    const lifeColor = i === this.playerId ? '#afa' :
                      i % 2 === this.playerId % 2 ? '#aaf' :
                      '#faa' 

    if (i == this.playerId) this.player = hero
    
    hero.body = new Components.CircleBody(x, y, 10, 1, heroClass.color, heroClass.speed)
    hero.add(hero.body)
    hero.add(new Components.Life(lifeColor, heroClass.life))
    hero.add(new Components.Destination)
    hero.add(new Components.Name(e[0]))

    return hero
  }

  createBase(x, y, my) {
    const base = new Entity
    
    base.body = new Components.CircleBody(x, y, 30)
    base.add(base.body)
    base.add(new Components.Life(my ? '#faa' : '#afa', 300))

    return base
  }
  
  generateBorders() {
    const borders = []

    borders.push(this.generateLine(-300, -300, -300, 600))
    borders.push(this.generateLine(-300, 600, 900, 600))
    borders.push(this.generateLine(900, 600, 900, -300))
    borders.push(this.generateLine(900, -300, -300, -300))

    return borders
  }

  generateLine(x, y, a, b) {
    const border = new Entity

    border.body = new Components.LineBody(x, y, a, b)
    border.add(border.body)
    
    return border
  }

  superPower(n) {
    if (n === 'center')
      this.camera.position = Vector.add(Vector.not(this.player.body.position), new Vector(320, 180))
    else 
      Server.emit('power', n)
  }

  power(id, n) {
    Server.disconnect()
  }

  update() {
    for (const object of this.board.values()) if (object['update']) object['update']()

    this.camera.draw(this.board.values())

    this.drawUI()
  }

  drawUI() {
    Draw.text(320, 20, '#fff', '12px Impact', 'center', (this.time * .01) | 0)

    const life = this.player.components.get(Components.Life.name)

    if (!life.alive) {
      Draw.rect(0, 0, 640, 360, 'rgba(0,0,0,.3)')

      Draw.text(320, 330, '#eee', '20px Impact', 'center', 'Your hero\'s OFFLINE!')
    } else {
      Draw.rect(280, 330, 80 * (life.life / life.maxLife), 4, '#afa')

      // umiejetnosci, po uzyciu, ładowanie
      Draw.rect(280, 337, 18, 18, '#dde')
      Draw.text(289, 354, '#333', '12px Impact', 'center', 'OFF')
      Draw.rect(300, 337, 18, 18, '#ded')
      Draw.text(309, 354, '#333', '12px Impact', 'center', '2')
      Draw.rect(320, 337, 18, 18, '#edd')
      Draw.text(329, 354, '#333', '12px Impact', 'center', '3')

      Draw.rect(342, 337, 18, 18, '#ddd')
      Draw.text(351, 354, '#333', '12px Impact', 'center', 'c')
    }
  }

  fixedUpdate() {
    for (const object of this.board.values()) if (object['fixedUpdate']) object['fixedUpdate']()

    this.physics.move(this.board)
    this.physics.collideObjects([...this.board.values()].filter(e =>
        !e.components.has(Components.Life.name) || e.components.get(Components.Life.name).alife
      ), e => {
      if (e.components.has(Components.Life.name))
        e.components.get(Components.Life.name).life -= 10
    })

    this.time--

    if (this.time < 0) {
      Server.emit('end', -1)
      this.nextScene(-1)
    }
  }

  nextScene(winner) {
    Game.setupScene(new End(winner, this.players))
  }

  destroy() {
    Draw.clear()
    this.board.clear()

    Mouse.onMove  = v => {}
    Mouse.onClick = v => {}
    Server.off()
  }
}