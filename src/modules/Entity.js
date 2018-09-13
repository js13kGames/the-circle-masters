export class Entity {
  constructor() {
    this.id = Entity.entityId++

    this.active = true
    this.components = new Map
    
    this.body = null

    const prepareFunc = (functionName) => (...a) => {
      if (this.active) for (const component of this.components.values())
        if (component[functionName]) component[functionName](...a)
    }

    ;['draw', 'update', 'fixedUpdate'].map(v => this[v] = prepareFunc(v))
  }

  add(component) {
    component.entity = this

    this.components.set(component.constructor.name, component)
  }
}

Entity.entityId = 0