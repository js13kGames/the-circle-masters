import { Component } from '../modules/Component.js'
import { Vector } from '../modules/Vector.js'

export class Destination extends Component {
  constructor(destination = null, force = .2) {
    super()

    this.destination = destination
    this.force = force
  }

  setDestination(destination, force = .2) {
    this.destination = destination
    this.force = force

    return this
  }

  getDestination() {
    return this.destination
  }

  fixedUpdate() {
    if (!this.entity || !this.entity.body || !this.destination) return

    const dest = Vector.sub(
      this.entity.body.position,
      this.destination
    )

    this.entity.body.force = 
    // Vector.add(
      // this.entity.body.force,
      Vector.mul(this.force, Vector.not(dest.unit()))
    // )

    if (dest.len() < 1) {
      this.destination = null
      // this.entity.body.force = dest.unit()
      this.entity.body.force = new Vector()
    //   this.entity.body.velocity = new Vector()
    }
  }
}