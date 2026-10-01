import { defineConfig } from '@umijs/max';
import { resolve } from 'path';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: '@/pages/Home',
    },
  ],
  npmClient: 'pnpm',
  utoopack: {},
  alias: {
    shared: resolve(__dirname, '../shared/src'),
  },
});

