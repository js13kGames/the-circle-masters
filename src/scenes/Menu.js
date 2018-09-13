import { Scene } from '../modules/Scene.js'
import { Draw } from '../imports.js'
import { Keyboard } from '../systems/Keyboard.js'
import { Mouse } from '../systems/Mouse.js'
import { Game } from '../systems/Game.js';

import { Lobby } from '../modules/Scenes.js'

export class Menu extends Scene {
  start() {
    this.name = 'AEIOU'.charAt(Math.random() * 5) + Math.random().toString(36).slice(2,7).replace(/[\.0-9]/g, '')
    this.blink = 0
    this.upper = false
    this.selected = false

    Keyboard.onDown = k => {
      if (k == 13) {
        Game.setupScene(new Lobby(this.name, Game.classes[0].name))
      } else if (k == 8)
        this.name = this.name.slice(0, -1)
      else if (k == 16)
        this.upper = true
      else if (k > 64 && k < 91)
        this.name += String.fromCharCode(k + 32 * +!this.upper)
      else if (k > 47 && k < 58)
        this.name += k - 48
    }

    Keyboard.onUp = k => {
      if (k == 16) this.upper = false
    }

    Mouse.onClick = v => {
      const y = 210, x = 120, r = i => this.selected === i ? 33 : 30
      
      Game.classes.forEach((e, i) => {
        if ((v.x - (x + i * 100))**2 + (v.y - y)**2 <= r(i)**2) {
          Game.setupScene(new Lobby(this.name, e.name))
        }
      })
    }

    Mouse.onHover = v => {
      this.selected = false
      
      const y = 210, x = 120, r = i => this.selected === i ? 33 : 30

      Game.classes.forEach((e, i) => {
        if ((v.x - (x + i * 100))**2 + (v.y - y)**2 <= r(i)**2) this.selected = i
      })
    }
  }

  update() {
    Draw.clear()

    Draw.text(50, 60, '#ccc', '20px Impact', 'left', 'Enter your name and then choose class')
    Draw.text(90, 140, '#ccc', '20px Impact', 'left', this.name + (this.blink > 30 ? '|' : ''))

    const y = 210, x = 120, r = i => this.selected === i ? 33 : 30

    Game.classes.forEach((e, i) => {
      Draw.circle(x + i * 100, y, r(i), e.color)
      Draw.text(x + i * 100, y + 50, e.color, '14px Impact', 'center', e.name)
    })
    
    this.blink = (this.blink + 1) % 60
  }

  destroy() {
    Keyboard.onDown = k => {}
    Keyboard.onUp   = k => {}
    Mouse.onClick   = v => {}
    Mouse.onHover   = v => {}
  }
}