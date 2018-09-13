export class Game {
  static setupScene(scene) {
    Game.destroy()

    Game.start = () => scene.start()
    Game.update = () => scene.update()
    Game.fixedUpdate = () => scene.fixedUpdate()
    Game.destroy = () => scene.destroy()
    
    Game.start()
  }
  static start(){}
  static update(){}
  static fixedUpdate(){}
  static destroy(){}
}

Game.storage = localStorage

Game.classes = [
  {
    name: 'Speedy',
    color: '#ffa',
    speed: 1.1,
    life: 60
  },
  
  {
    name: 'Norman',
    color: '#aff',
    speed: 1,
    life: 100
  },
  
  {
    name: 'Faf',
    color: '#faf',
    speed: 1.05,
    life: 90
  },
  
  {
    name: 'Tanky',
    color: '#aaa',
    speed: 0.8,
    life: 200
  }
]