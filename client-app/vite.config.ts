import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../API/wwwroot'
  },
  server: {
    port: 3000
  },
  plugins: [react(),
    VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'BudgetStat',
          short_name: 'BudgetStat',
          start_url: '/',
          display: 'standalone',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          icons: [
            {
              src: 'icons/icon-600x600.png',
              sizes: '600x600',
              type: 'image/png',
            }
          ]
        }
      })
]
})
