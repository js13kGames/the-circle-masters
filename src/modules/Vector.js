export class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  static add(a, b) {
    return new Vector(a.x + b.x, a.y + b.y)
  }

  static sub(a, b) {
    return new Vector(a.x - b.x, a.y - b.y)
  }

  static mul(a, b) {
    return new Vector(a * b.x, a * b.y)
  }

  static div(a, b) {
    return new Vector(a.x / b, a.y / b)
  }

  static not(v) {
    return new Vector(-v.x, -v.y)    
  }

  static dot(v, w) {
    return v.x * w.x + v.y * w.y
  }

  static isZero(v) {
    return v.x != 0 && v.y != 0
  }

  static cosBetween(v, w) {
    return Vector.dot(v, w) / (v.len() * w.len())
  }
  
  len() {
    return Math.hypot(this.x, this.y)
  }

  dist(v) {
    return Vector.sub(this, v).len()
  }
  
  unit() {
    return Vector.div(this, this.len())
  }

  reflect(n) {
    return Vector.sub(Vector.mul(2 * Vector.dot(this, n), n), this)
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  compAlong(a) {
    let dot_ov = Vector.dot(this, a) / a.len()
    return new Vector(dot_ov, Math.sqrt(this.len() * this.len() - dot_ov * dot_ov))
  }
}
