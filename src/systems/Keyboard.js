export class Keyboard {
  static input(key, state) {
    if (state) this.onDown(key)
    else this.onUp(key)
  }
}

Keyboard.onDown = k => {}
Keyboard.onUp   = k => {}