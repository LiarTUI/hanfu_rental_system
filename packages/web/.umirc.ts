import { defineConfig } from '@umijs/max';
import { resolve } from 'path';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  headScripts: ['https://at.alicdn.com/t/c/font_5240047_g8j0dkdpyct.js'],
  routes: [
    {
      path: '/',
      component: '@/pages/Login',
    },
    {
      path: '/home',
      component: '@/pages/Home',
    },
    {
      path: '/personalCenter',
      component: '@/pages/PersonalCenter',
    },
  ],
  npmClient: 'pnpm',
  utoopack: {},
  alias: {
    shared: resolve(__dirname, '../shared/src'),
  },
  proxy: {
    '/api': {
      target: 'http://10.105.4.127:8080',
      changeOrigin: true,
    },
  },
});
