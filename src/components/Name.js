import { Component } from '../modules/Component.js'
import { Draw } from '../imports.js'
import { Life } from './Life.js'

export class Name extends Component {
  constructor(name = 'none') {
    super()

    this.name = name
  }

  draw(cameraPosition, scale) {
    if (!this.entity) return
    if (this.entity.components.get(Life.name) && !this.entity.components.get(Life.name).alive) return

    let {position, radius} = this.entity.body

    Draw.text(
      (cameraPosition.x + position.x) * scale,
      (cameraPosition.y + position.y + radius + 10) * scale,
      '#ccc',
      '11px Impact',
      'center',
      this.name
    )

  }
}