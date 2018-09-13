export class Board extends Map {
  constructor(w = 1, h = 1) {
    super()
    this.w = w
    this.h = h
  }
  
  add(entities) {
    if (!Array.isArray(entities))
      this.set(entities.id, entities)
    else for (const entity of entities)
      this.set(entity.id, entity)

    return this
  }



  /*
  getHash(e) {
    return [0, 0]//[e.x, e.y]
  }

  push(element) {
    // let hash : Array<i32> = this.getHash(element)
    // this.objects[hash[0]][hash[1]].push(element)
    this.objects.push(element)
  }

  move() {
    // for (let i = 0; i < this.w; i++)
    //   for (let j = 0; j < this.h; j++)
    //     for (let k = 0; k < this.objects[i][j].length; k++)
    //       this.objects[i][j][k].move()

    for (let k = 0; k < this.objects.length; k++)
      this.objects[k].move()
  }

  checkCollisions() {
    // for (let i = 0; i < this.w; i++)
    //   for (let j = 0; j < this.h; j++)
    //     for (let k = 0; k < this.objects[i][j].length; k++)
    //       for (let l = k + 1; l < this.objects[i][j].length; l++)
    //         this.objects[i][j][k].collide(this.objects[i][j][l])

    for (let k = 0; k < this.objects.length; k++)
      for (let l = k + 1; l < this.objects.length; l++)
        this.objects[k].collide(this.objects[l])
  }

  update() {
    // for (let i = 0; i < w; i++)
    //   for (let j = 0; j < h; j++)
    //     for (let k = 0; k < this.objects[i][j]; k++)
    //       this.push(this.objects[i][j].splice(k, 1)[0])
  }

  draw(position) {
    // let o = this.objects[0]
    // draw.text(30, 30, 'black', itoa32(o.x) + ' ' + itoa32(o.y))

    // for (let i = 0; i < this.w; i++)
    //   for (let j = 0; j < this.h; j++)
    //     for (let k = 0; k < this.objects[i][j].length; k++)
    //       this.objects[i][j][k].draw(x, y)

    for (let k = 0; k < this.objects.length; k++)
      this.objects[k].draw(position)
  }*/
}
