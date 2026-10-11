import { defineConfig } from '@umijs/max';
import { resolve } from 'path';
import { address } from '../shared/src/backendAddress';
export default defineConfig({
  base: '/admin/',
  publicPath: '/admin/',
  antd: {},
  model: {},
  initialState: {},
  access: {},
  request: {},
  favicons: ['/ll.svg'],
  headScripts: ['https://at.alicdn.com/t/c/font_5240047_8oal9bcdk3o.js'],
  layout: {
    title: '华衿后台',
    locale: false,
    logo: '/manageLogo.svg',
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: '工作台',
      component: '@/pages/Dashboard',
    },
    {
      path: '/order',
      name: '订单管理',
      routes: [
        {
          path: '/order/list',
          component: '@/pages/order/list',
          name: '订单列表',
        },
        {
          path: '/order/ship',
          component: '@/pages/order/ship',
          name: '发货管理',
        },
      ],
    },
    {
      path: '/product',
      name: '商品管理',
      routes: [
        {
          path: '/product/list',
          component: '@/pages/product/list',
          name: '商品列表',
        },
        {
          path: '/product/sku',
          component: '@/pages/product/sku',
          name: 'SKU 管理',
        },
      ],
    },
    {
      path: '/store',
      name: '店铺管理',
      routes: [
        {
          path: '/store/list',
          component: '@/pages/store/list',
          name: '店铺列表',
        },
      ],
    },
    {
      path: '/member',
      name: '用户管理',
      routes: [
        {
          path: '/member/list',
          component: '@/pages/member/list',
          name: '用户列表',
        },
        {
          path: '/member/review',
          component: '@/pages/member/review',
          name: '用户评价',
        },
      ],
    },
    {
      path: '/system',
      name: '系统管理',
      access: 'menuSystem',
      routes: [
        {
          path: '/system/user',
          component: '@/pages/system/user',
          name: '用户管理',
        },
        {
          path: '/system/role',
          component: '@/pages/system/role',
          name: '角色管理',
        },
        {
          path: '/system/menu',
          component: '@/pages/system/menu',
          name: '菜单管理',
        },
        {
          path: '/system/dict',
          component: '@/pages/system/dict',
          name: '字典管理',
        },
      ],
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
