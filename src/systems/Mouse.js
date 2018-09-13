import { Vector } from '../modules/Vector.js'

export class Mouse {
  static input(x, y, state) {
    let currentMouse = new Vector(x, y)

    if (state == 1) {
      this.savedMouse = currentMouse
    } else if (state == -1) {
      if (this.panMouse)
        this.onMove(Vector.sub(this.savedMouse, currentMouse))
      else
        this.onClick(currentMouse)

      this.panMouse = false
      this.savedMouse = new Vector(-1, -1)
    } else if (this.savedMouse.x != -1 && Vector.sub(this.savedMouse, currentMouse).len() > 2) {
      this.onMove(Vector.sub(this.savedMouse, currentMouse))

      this.savedMouse = currentMouse
      this.panMouse = true
    }

    Mouse.onHover(currentMouse)
  }
}

Mouse.savedMouse  = new Vector(-1, -1)
Mouse.panMouse    = false
Mouse.onMove      = v => {}
Mouse.onClick     = v => {}
Mouse.onHover     = v => {}