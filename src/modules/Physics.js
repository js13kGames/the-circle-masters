import { Vector } from './Vector.js'

import * as Components from '../modules/Components.js'

const PHYSICS_RESISTANCE = 1
const PHYSICS_FRICTION = 1.2
const PHYSICS_MAX_VELOCITY = 3
const PHYSICS_EPSILON = .01

export class Physics {
  move(objects) {
    for (const object of objects.values()) {
      object.body.force = Vector.div(object.body.force, PHYSICS_RESISTANCE)
      
      if (object.body.force.len() < PHYSICS_EPSILON)
        object.body.force = new Vector

      object.body.velocity = Vector.add(
        Vector.div(object.body.velocity, PHYSICS_FRICTION),
        object.body.force
      )
      
      if (object.body.velocity.len() > PHYSICS_MAX_VELOCITY)
        object.body.velocity = Vector.mul(PHYSICS_MAX_VELOCITY * object.body.maxSpeed, object.body.velocity.unit())

      if (object.body.velocity.len() < PHYSICS_EPSILON)
        object.body.velocity = new Vector

      object.body.position = Vector.add(object.body.position, object.body.velocity)
    }
  }

  collideObjects(arr, collided) {
    for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++)
        this.collideTwo(arr[i].body, arr[j].body, e => collided(e))
  }

  collideTwo(a, b, collided) {
    if (a.constructor.name === Components.CircleBody.name && b.constructor.name === Components.CircleBody.name) {
      
      if (Vector.sub(a.position, b.position).len() <= a.radius + b.radius) {
        collided(a.entity)
        collided(b.entity)
        
        const normal = Vector.sub(a.position, b.position)
        const u = new Vector(normal.y, -normal.x)
  
        const sinAlpha = u.y / u.len()
        const cosAlpha = u.x / u.len()
        const sinTwoAlpha = 2 * sinAlpha * cosAlpha
        const cosTwoAlpha = cosAlpha * cosAlpha - sinAlpha  * sinAlpha
        
        a.velocity = new Vector(a.velocity.x * cosTwoAlpha + a.velocity.y * sinTwoAlpha, a.velocity.x * sinTwoAlpha - a.velocity.y * cosTwoAlpha)
        b.velocity = new Vector(b.velocity.x * cosTwoAlpha + b.velocity.y * sinTwoAlpha, b.velocity.x * sinTwoAlpha - b.velocity.y * cosTwoAlpha)
      
        a.force = new Vector(a.force.x * cosTwoAlpha + a.force.y * sinTwoAlpha, a.force.x * sinTwoAlpha - a.force.y * cosTwoAlpha)
        b.force = new Vector(b.force.x * cosTwoAlpha + b.force.y * sinTwoAlpha, b.force.x * sinTwoAlpha - b.force.y * cosTwoAlpha)
      
        if (a.entity.components.get(Components.Destination.name)) a.entity.components.get(Components.Destination.name).setDestination(null)
        if (b.entity.components.get(Components.Destination.name)) b.entity.components.get(Components.Destination.name).setDestination(null)
        // a.velocity = new Vector(a.force.x * cosTwoAlpha + a.force.y * sinTwoAlpha, a.force.x * sinTwoAlpha - a.force.y * cosTwoAlpha)
        // b.velocity = new Vector(b.force.x * cosTwoAlpha + b.force.y * sinTwoAlpha, b.force.x * sinTwoAlpha - b.force.y * cosTwoAlpha)
      }

    } else if (a.constructor.name === Components.CircleBody.name && b.constructor.name === Components.LineBody.name) {

      const v = Vector.sub(b.position, b.endPosition)
      const u = v.len()
      const x = Vector.sub(b.position, a.position).len()
      const y = Vector.sub(b.endPosition, a.position).len()
      
      if (a.radius > Math.sqrt(x**2 - ((x**2 - y**2 + u**2) / (2 * u))**2)) {
        collided(a.entity)
        collided(b.entity)

  
        let sinAlpha = v.y / u
        let cosAlpha = v.x / u
        let sinTwoAlpha = 2 * sinAlpha * cosAlpha
        let cosTwoAlpha = cosAlpha * cosAlpha - sinAlpha  * sinAlpha
        
        a.velocity = new Vector(a.velocity.x * cosTwoAlpha + a.velocity.y * sinTwoAlpha, a.velocity.x * sinTwoAlpha - a.velocity.y * cosTwoAlpha)
        a.force = new Vector(a.force.x * cosTwoAlpha + a.force.y * sinTwoAlpha, a.force.x * sinTwoAlpha - a.force.y * cosTwoAlpha)
        
        // b.velocity = new Vector(b.velocity.x * cosTwoAlpha + b.velocity.y * sinTwoAlpha, b.velocity.x * sinTwoAlpha - b.velocity.y * cosTwoAlpha)
      }

    } else if (a.constructor.name === Components.LineBody.name && b.constructor.name === Components.CircleBody.name) {
      
      this.collideTwo(b, a, collided)

    } else if (a.constructor.name === Components.LineBody.name && b.constructor.name === Components.LineBody.name) {
    
      // two lines
    
    }
  }
}