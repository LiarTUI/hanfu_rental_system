import { defineConfig } from '@umijs/max';
import { resolve } from 'path';
import { address } from '../shared/src/backendAddress';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  favicons: ['/logo.svg'],
  headScripts: ['https://at.alicdn.com/t/c/font_5240047_8oal9bcdk3o.js'],
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: '@/pages/Home',
    },
    {
      path: '/personalCenter',
      component: '@/pages/PersonalCenter',
    },
    {
      path: '/orders',
      component: '@/pages/MyOrders',
    },
    {
      path: '/buy/:id',
      component: '@/pages/Buy',
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
