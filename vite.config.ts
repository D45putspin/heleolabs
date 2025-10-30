import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Listen on all addresses including LAN and public
        port: 5173,
        strictPort: false,
        allowedHosts: [
            '.ngrok-free.app',
            '.ngrok.io',
            'localhost',
        ],
    },
})

