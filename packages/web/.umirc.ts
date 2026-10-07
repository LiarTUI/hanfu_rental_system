import { defineConfig } from '@umijs/max';
import { resolve } from 'path';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  headScripts: ['https://at.alicdn.com/t/c/font_5240047_8oal9bcdk3o.js'],
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
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
});
