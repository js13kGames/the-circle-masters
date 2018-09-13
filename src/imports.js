export const Engine = {
  width: 640,
  height: 360,
  canvas: document['querySelector']('canvas'),
  context: document['querySelector']('canvas')['getContext']('2d'),
  // @ts-ignore
  socket: io({'upgrade': false, 'autoConnect': false, 'transports': ['websocket']})
}

Engine.canvas['width'] = Engine.width
Engine.canvas['height'] = Engine.height

export const Draw = {
  clear: () => {
    Engine.context['beginPath']()
    Engine.context['clearRect'](0, 0, Engine.width, Engine.height)
  },
  circle: (x, y, radius, color) => {
    Engine.context['beginPath']()
    Engine.context['fillStyle'] = color
    Engine.context['arc'](x, y, radius, 0, Math.PI * 2)
    Engine.context['fill']()
  },
  rect: (x, y, width, height, color) => {
    Engine.context['fillStyle'] = color
    Engine.context['fillRect'](x, y, width, height)
  },
  line: (x, y, a, b, color) => {
    Engine.context['strokeStyle'] = color
    Engine.context['beginPath']()
    Engine.context['moveTo'](x, y)
    Engine.context['lineTo'](a, b)
    Engine.context['stroke']()
  },
  text: (x, y, color, font, align, text) => {
    Engine.context['font'] = font
    Engine.context['textAlign'] = align
    Engine.context['fillStyle'] = color
    Engine.context['fillText'](text, x, y)
  }
}

export const Server = {
  connect: () => Engine.socket['open'](),
  emit: (e, ...a) => Engine.socket['emit'](e, ...a),
  on: (event, callback) => Engine.socket['on'](event, callback),
  off: (...a) => Engine.socket['off'](...a),
  disconnect: () => Engine.socket['close']()
}