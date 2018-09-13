import { Draw } from '../imports.js'

import { Game } from '../systems/Game.js'
import { Keyboard } from '../systems/Keyboard.js'
import { Mouse } from '../systems/Mouse.js'

import { Scene } from '../modules/Scene.js'

import { Menu } from '../modules/Scenes.js'

export class End extends Scene {
  constructor(winner, players) {
    super()
    
    this.winner = winner
    this.players = players
  }
  start() {
    Keyboard.onDown = k => this.nextScene()
    Mouse.onClick   = v => this.nextScene()

    Draw.clear()
    Draw.text(70, 170, '#fff', '40px Impact', 'left',
      this.winner === -1 ? 'There is no winner' : 'The winner is: ' + this.players[this.winner][0])
    Draw.circle(580, 300, 40, Game.classes.filter(e => e.name === this.players[this.winner][1]).pop().color)
    Draw.text(70, 300, '#fff', '20px Impact', 'left', 'Click to return to the menu')
  }

  destroy() {
    Keyboard.onDown = k => {}
    Mouse.onClick   = v => {}
  }

  nextScene() {
    Game.setupScene(new Menu)
  }
}