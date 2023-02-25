import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: ''
  },
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '公司列表',
      path: '/table',
      component: './Table',
    },
    {
      name: '小程序',
      path: '/application',
      component: './Application',
    },
    {
      name: '小程序详情',
      path: '/application/:appid',
      component: './Application/detail',
      hideInMenu: true
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      'target': 'http://localhost:3800',
      'changeOrigin': true,
      'pathRewrite': { '/api' : '/' },
    },
  },
});

