import { Draw } from '../imports.js'
import { Body } from './Body.js'

import { Vector } from '../modules/Vector.js'
import { Life } from './Life.js'

export class LineBody extends Body {
  constructor(x = 0, y = 0, a = 1, b = 1, mass = 1, color = '#555') {
    super(x, y, mass)
    this.endPosition = new Vector(a, b)
    this.color = color
  }

  draw(position, scale) {
    if (!this.entity.components.get(Life.name) || this.entity.components.get(Life.name).alive)
      Draw.line(
        (position.x + this.position.x) * scale,
        (position.y + this.position.y) * scale,
        (position.x + this.endPosition.x) * scale,
        (position.y + this.endPosition.y) * scale,
        this.color
      )
  }
}