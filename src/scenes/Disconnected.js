import { Draw } from '../imports.js'

import { Game } from '../systems/Game.js'
import { Keyboard } from '../systems/Keyboard.js'
import { Mouse } from '../systems/Mouse.js'

import { Scene } from '../modules/Scene.js'

import { Menu } from '../modules/Scenes.js'

export class Disconnected extends Scene {
  start() {
    Draw.clear()
    Draw.text(30, 70, '#fff', '20px Impact', 'left',
      'You\'re OFFLINE. Click to go back to the menu!')
    Keyboard.onDown = k => this.nextScene()
    Mouse.onClick   = v => this.nextScene()
  }
  destroy() {
    Keyboard.onDown = k => {}
    Mouse.onClick   = v => {}
  }

  nextScene() {
    Game.setupScene(new Menu)
  }
}