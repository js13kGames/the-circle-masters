import { Component } from '../modules/Component.js'
import { Vector } from '../modules/Vector.js'

export class Body extends Component {
  constructor(x = 0, y = 0, m = 1, staticBody = false) {
    super()
    
    this.position = new Vector(x, y)
    this.velocity = new Vector(0, 0)
    this.force    = new Vector(0, 0)
    this.mass     = m
    this.static   = staticBody
    this.home     = this.position.clone()
  }
}