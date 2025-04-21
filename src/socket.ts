import { DefaultEventsMap } from "@socket.io/component-emitter"
import { io, Socket } from "socket.io-client"

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined

export const getSocket = () => {
  if (!socket || typeof socket === undefined) {
    socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: false,
    })
  }
  return socket
}
