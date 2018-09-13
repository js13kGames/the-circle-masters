import { Draw } from '../imports.js'
import { Body } from './Body.js'
import { Life } from './Life.js'

export class CircleBody extends Body {
  constructor(x = 0, y = 0, radius = 1, mass = 1, color = '#ccc', maxSpeed = 1) {
    super(x, y, mass)
    this.radius = radius
    this.color = color
    this.maxSpeed = maxSpeed
  }

  draw(position, scale) {
    if (!this.entity.components.get(Life.name) || this.entity.components.get(Life.name).alive)
      Draw.circle(
        (position.x + this.position.x) * scale,
        (position.y + this.position.y) * scale,
        this.radius * scale,
        this.color
      )
  }
}