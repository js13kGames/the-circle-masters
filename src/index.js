import { Engine } from './imports.js'

import { Game } from './systems/Game.js'
import { Title } from './scenes/Title.js'

import { Mouse } from './systems/Mouse.js'
import { Keyboard } from './systems/Keyboard.js'

function tick() {
  Game.update()
  requestAnimationFrame(tick)
}

const fixedTick = ((oldTime = 0) => (newTime = 0, ticks = newTime - oldTime) => {  
  while (ticks > 0) Game.fixedUpdate(), ticks -= 10

  oldTime = newTime - ticks
  
  setTimeout(() => fixedTick(performance.now()), 10)
})()

;['mouseup', 'mousemove', 'mousedown'].forEach((e, i) =>
  Engine.canvas['addEventListener'](e, event => Mouse.input(
    event['offsetX'] / Engine.canvas['offsetWidth'] * Engine.width,
    event['offsetY'] / Engine.canvas['offsetHeight'] * Engine.height,
    i - 1
  ), true)
)

;['keyup', 'keydown'].forEach((e, i) =>
  document['addEventListener'](e, event => Keyboard.input(event['keyCode'], i), true)
)

Game.setupScene(new Title)

tick()
fixedTick()
