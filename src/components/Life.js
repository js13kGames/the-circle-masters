import { Component } from '../modules/Component.js'
import { Draw } from '../imports.js'
import { Destination } from './Destination.js'
import { Vector } from '../modules/Vector.js'

const RESET_COUNTDOWN = 400

export class Life extends Component {
  constructor(color = 'red', life = 100, alive = true) {
    super()

    this.color = color
    this.alive = alive
    this.life = life
    this.maxLife = life
  }

  draw(cameraPosition, scale) {
    if (!this.entity) return

    let {position, radius} = this.entity.body

    if (this.alive) Draw.rect(
      (cameraPosition.x + position.x - radius) * scale,
      (cameraPosition.y + position.y - radius - 7) * scale,
      (radius * 2 * this.life / this.maxLife) * scale,
      3 * scale,
      this.color
    ) 
  }

  fixedUpdate() { 
    if (this.life > 0) {
      if (!this.alive) {
        this.entity.body.position = this.entity.body.home.clone()
        this.entity.body.velocity = new Vector
        this.entity.body.force = new Vector
        this.entity.components.get(Destination.name).setDestination(null)

        this.alive = true
        this.life = this.maxLife
      }
    } else {
      if (!this.alive) {
        this.life++
      } else {
        this.alive = false
        this.life = -RESET_COUNTDOWN
      }
    }
  }
}