import { DefaultEventsMap } from "@socket.io/component-emitter"
import { io, Socket } from "socket.io-client"

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined

export const getSocket = () => {
  if (!socket || typeof socket === undefined) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: {
        Authorization: String(localStorage.getItem("jwt")),
      },
      transports: ["websocket"],
    })
  }
  return socket
}
