// src/websocket.js
import ReconnectingWebSocket from 'reconnecting-websocket'

const createWebSocket = (url: string, options = {}) => {
  const ws = new ReconnectingWebSocket(url, [], options)

  ws.onopen = () => {
    console.log('WebSocket connection opened')
  }

  ws.onclose = () => {
    console.log('WebSocket connection closed')
  }

  ws.onmessage = (message) => {
    console.log('Received message:', message.data)
  }

  return ws
}

export default createWebSocket
