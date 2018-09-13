import { Draw } from '../imports.js'

import { Game } from '../systems/Game.js'
import { Keyboard } from '../systems/Keyboard.js'
import { Mouse } from '../systems/Mouse.js'

import { Scene } from '../modules/Scene.js'

import { Menu } from '../modules/Scenes.js'

export class Title extends Scene {
  start() {
    this.timer = 5 * 100
    Keyboard.onDown = k => this.nextScene()
    Mouse.onClick   = v => this.nextScene()
  }

  update() {
    Draw.clear()
    Draw.circle((400 - this.timer) * 2, 200, 60 - (500 - this.timer) / 500 * 60, '#ccc')
    Draw.text(320, 170, '#fff', '60px Impact', 'center', 'The Circle Masters')
  }

  fixedUpdate() {
    if (--this.timer < 0) this.nextScene()
  }

  destroy() {
    Keyboard.onDown = k => {}
    Mouse.onClick   = v => {}
  }

  nextScene() {
    Game.setupScene(new Menu)
  }
}