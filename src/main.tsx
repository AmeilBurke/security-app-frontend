import React from "react"
import { createRoot } from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "./app/store"
import { BrowserRouter, Route, Routes } from "react-router";
import PageDashboard from "./pages/PageDashboard"
import PageApp from "./pages/PageApp"
import './main.css'
import { Toaster } from "@/components/ui/toaster"
import { Provider as ChakraProvider } from "@/components/ui/provider"
import { ThemeProvider } from "next-themes";
import PageAccountSettings from "./pages/PageAccountSettings";
import { system } from "./themes";


const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <ChakraProvider >
          <BrowserRouter>
            <PageApp />
            <Routes>
              <Route path="/" element={<PageDashboard />} ></Route>
              <Route path="/account-settings" element={<PageAccountSettings />} ></Route>
              {/* <Route path="/venue/:venueId" element={} ></Route> */}
            </Routes>
            <Toaster />
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
