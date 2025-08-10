import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Explicit server config so Live Share (and other remote collaborators) can access the dev server.
// host: true -> 0.0.0.0 (listen on all interfaces)
// strictPort ensures it stays on 5173 (so the forwarded port matches expectations)
// hmr.clientPort helps guests whose websocket needs to resolve via the forwarded port
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // or '0.0.0.0'
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
  },
})
