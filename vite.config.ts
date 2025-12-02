import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: './', // 设置为相对路径
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // 使用UMD格式以确保浏览器兼容性
    rollupOptions: {
      output: {
        format: 'umd',
        name: 'BlogApp',
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // 禁用代码分割
        manualChunks: undefined
      }
    },
    sourcemap: false
  },
  // 设置合适的目标浏览器
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2018'
    }
  }
})
