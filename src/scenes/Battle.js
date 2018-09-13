import { Draw, Server } from '../imports.js'

import { Game } from '../systems/Game.js'
import { Mouse } from '../systems/Mouse.js'

import { Scene } from '../modules/Scene.js'
import { Camera } from '../modules/Camera.js'
import { Physics } from '../modules/Physics.js'
import { Entity } from '../modules/Entity.js'
import { Board } from '../modules/Board.js'
import { Vector } from '../modules/Vector.js'

import * as Components from '../modules/Components.js'

import { Menu, Disconnected } from '../modules/Scenes.js'

export class Battle extends Scene {
  constructor(players, id) {
    super()

    this.playerId = id - 1
    this.players = players
  }

  start() {
    this.camera = this.playerId % 2 ? new Camera(-300, -285) : new Camera(350, 350)
    this.physics = new Physics

    this.time = 5 * 60 * 100 + 99

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
      const dest = Vector.sub(v, this.camera.position)
      Server.emit('target', dest.x, dest.y)
    }

    Server.on('target', (id, x, y) => {
      [...this.board.values()][id].components.get(Components.Destination.name)
        .setDestination(new Vector(x, y))
    })

    Server.on('disconnect', () => {
      Game.setupScene(new Disconnected)
    })
    
    Server.on('end', id => {
      Server.disconnect()
      this.nextScene(id)
    })

    // todo create superpowers
    // todo class spec
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

    if (i == this.playerId - 1) this.player = hero
    
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

  update() {
    for (const object of this.board.values()) if (object['update']) object['update']()

    this.camera.draw(this.board.values())

    this.drawUI()
  }

  drawUI() {
    Draw.text(320, 20, '#fff', '12px Impact', 'center', (this.time * .01) | 0)

    Draw.rect(280, 330, 80, 4, '#afa')
    Draw.rect(280, 337, 18, 18, '#fff')
    Draw.rect(300, 337, 18, 18, '#fff')
    Draw.rect(320, 337, 18, 18, '#fff')
    Draw.rect(342, 337, 18, 18, '#fff')

    
    // umiejetnosci, wysrodkuj
  }

  fixedUpdate() {
    for (const object of this.board.values()) if (object['fixedUpdate']) object['fixedUpdate']()

    this.physics.move(this.board)
    this.physics.collideObjects(this.board, e => {
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
    Game.setupScene(new Menu)
  }

  destroy() {
    Draw.clear()
    this.board.clear()

    Mouse.onMove  = v => {}
    Mouse.onClick = v => {}
    Server.off()
  }
}