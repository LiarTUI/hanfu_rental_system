import { defineConfig } from '@umijs/max';
import { resolve } from 'path';
import { address } from 'shared';
import ll from './src/assets/logo.svg';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  favicons: [ll],
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
      target: address,
      changeOrigin: true,
    },
  },
});
