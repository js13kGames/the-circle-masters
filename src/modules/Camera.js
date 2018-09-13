import { Draw } from '../imports.js'
import { Vector } from './Vector.js'

export class Camera {
  constructor(x = 0, y = 0) {
    this.position = new Vector(x, y)
    this.scale    = 1
  }

  draw(objectsArray) {
    Draw.clear()

    for (const object of objectsArray) if (object['draw']) object['draw'](this.position, this.scale)
  }
}