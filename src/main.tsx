import React from "react"
import { store } from "./app/store"
import { createRoot } from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { Provider as ChakraProvider } from "@/components/ui/provider"
import { BrowserRouter, Route, Routes } from "react-router";
import './main.css'
import { Toaster } from "@/components/ui/toaster"
import PageApp from "./pages/PageApp";
import PageSignIn from "./pages/PageSignIn";
import PageDashboard from "./pages/PageDashboard"
import PageCreateAlert from "./pages/PageCreateAlert"
import ComponentContainer from "./components/container/ComponentContainer"


const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <ChakraProvider >
          <BrowserRouter>
            <ComponentContainer>
              <>
                <PageApp />
                <Routes>
                  <Route path="/sign-in" element={<PageSignIn />} ></Route>
                  <Route path="/" element={<PageDashboard />} ></Route>
                  <Route path="/create-alert" element={<PageCreateAlert />} ></Route>
                </Routes>
                <Toaster />
              </>
            </ComponentContainer>
          </BrowserRouter>
        </ChakraProvider>
      </ReduxProvider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
