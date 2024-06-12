import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: "./",
  css: {
    preprocessorOptions: {
      stylus: {
        // 这里你可以添加 Stylus 的全局变量或者其他配置
      }
    }
  }
})
