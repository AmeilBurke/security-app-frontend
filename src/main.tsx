import React from "react"
import { createRoot } from "react-dom/client"
import { store } from "./app/store"
import { Provider as ReduxProvider } from "react-redux"
import { Provider as ChakraProvider } from "@/components/ui/provider"
import router from "./router"
import "./main.css"
import { RouterProvider } from "react-router"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </ReduxProvider>
    </React.StrictMode>,
  )
} else {
  throw new Error("Root element with ID 'root' was not found in the document.")
}