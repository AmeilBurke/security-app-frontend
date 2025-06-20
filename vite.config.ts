import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true,
    host: true,
    https: {
      cert: "C:\\Users\\Ameil\\Documents\\Certificates\\ilt security app\\192.168.1.65.pem",
      key: "C:\\Users\\Ameil\\Documents\\Certificates\\ilt security app\\192.168.1.65-key.pem",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
