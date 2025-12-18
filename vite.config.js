import { defineConfig } from 'vite'

export default defineConfig({
  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true, // Abre o navegador automaticamente
    host: true  // Permite acesso via rede local
  },
  
  // Configuração de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  
  // Base path (para GitHub Pages ou similar)
  base: './'
})
