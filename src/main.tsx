import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import { Provider as ChakraProvider } from "@/components/ui/provider"
import { BrowserRouter, Route, Routes } from "react-router";
import PageDashboard from "./pages/PageDashboard"
import PageIndividualVenue from "./pages/PageIndividualVenue"
import PageApp from "./pages/PageApp"
import './main.css'
import { Toaster } from "@/components/ui/toaster"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ChakraProvider>
          <BrowserRouter>
            <PageApp />
            <Routes>
              <Route path="/" element={<PageDashboard />} ></Route>
              <Route path="/venue/:venueId" element={<PageIndividualVenue />} ></Route>
            </Routes>
            <Toaster />
          </BrowserRouter>
        </ChakraProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
