import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // 项目站点用 /仓库名/；用户站点(xxx.github.io) 改为 '/' 或 './'
  base: '/frontendTools-gitHub/',
  plugins: [vue()],
})
