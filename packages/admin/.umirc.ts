import { defineConfig } from '@umijs/max';
import { resolve } from 'path';

export default defineConfig({
  antd: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '后台管理系统',
    locale: false,
  },
  routes: [
    {
      path: '/dashboard',
      component: '@/pages/Dashboard',
    },
  ],
  npmClient: 'pnpm',
  utoopack: {},
  alias: {
    shared: resolve(__dirname, '../shared/src'),
  },
});
