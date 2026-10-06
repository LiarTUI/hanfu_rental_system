export const APP_NAME = 'BS';

export const API_PREFIX = '/api';

/** 后台首页地址：开发环境跳 8002 端口，生产环境走 nginx 的 /admin/ 路径 */
export const ADMIN_HOME =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8002/dashboard'
    : '/admin/';

/** 用户端登录页地址：Login 页挂在根路由，开发环境跳 8000 端口 */
export const WEB_LOGIN =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/' : '/';
