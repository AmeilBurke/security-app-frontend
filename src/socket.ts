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
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })
  }
  return socket
}


        // fileReader.readAsDataURL(fileAcceptDetails.files[0])
        // fileReader.onload = () => {
        //     const result = fileReader.result?.toString().split(",")[1]
        //     if (typeof result === "string") {
        //     } else {
        //         toaster.create({
        //             title: "Invalid photo",
        //             description: "Upload another photo",
        //         })
        //         return
        //     }
        // }
        // fileReader.onerror = () => {
        //     toaster.create({
        //         title: "Invalid photo",
        //         description: "Upload another photo",
        //     })
        //     return
        // }