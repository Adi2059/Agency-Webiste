import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // App apne aap background mein update ho jayegi
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AfterUS CRM',
        short_name: 'AfterUS',
        description: 'Command Center & CRM for AfterUS Global',
        theme_color: '#0A1128', // Aapke app ke upar ka color
        background_color: '#F4F7FB',
        display: 'standalone', // Ye line browser URL bar ko gayab kar deti hai
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});