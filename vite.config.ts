import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';


export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ['favicon.ico', 'robots.txt', 'img/**/*'],
      manifest: {
        name: 'ZenLife',
        short_name: 'ZenLife',
        description: 'Une application tout-en-un pour prendre soin de soi',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['health', 'lifestyle'],
        icons: [
          {
            src: 'img/logo-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          // Mobile - Seulement 2 captures essentielles
          {
            src: 'screenshots/mobile-home.png',
            sizes: '390x844',
            type: 'image/png'
          },
          {
            src: 'screenshots/mobile-dash.png',
            sizes: '390x844',
            type: 'image/png'
          },

          // Desktop - Seulement 2 captures essentielles
          {
            src: 'screenshots/desktop-home.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: 'screenshots/desktop-dash.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      // Utiliser registerType au lieu de strategies
      registerType: 'autoUpdate',
      // Configuration workbox compatible
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/zenlife-api\.onrender\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
        // Retirez la propriété backgroundSync qui n'est pas supportée
      }
    }),
  ],
  // Le reste de votre configuration reste inchangé
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://zenlife-api.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
