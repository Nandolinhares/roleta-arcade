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
    minify: 'esbuild', // Usa esbuild (mais rápido e já incluído)
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  
  // Base path (para GitHub Pages)
  // Use '/' se configurar custom domain ou 'source: GitHub Actions'
  // Use '/nome-repo/' se usar 'source: Deploy from branch'
  base: process.env.GITHUB_ACTIONS ? '/roleta-arcade/' : '/'
})
