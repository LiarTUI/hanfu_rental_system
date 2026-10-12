// admin 端部署常量。
// 开发环境：双端口（web 8000 / admin 8002），路由无前缀；
// 生产环境：同域路径部署，admin 挂在 /admin 前缀下（umi base/publicPath 同步配置）
export const ADMIN_BASE = process.env.NODE_ENV === 'production' ? '/admin' : '';

// web/admin 同域共用 localStorage，token 用不同 key 隔离登录态
export const ADMIN_TOKEN_KEY = 'admin_token';

// 登录页地址（根路由）
export const LOGIN_URL = `${ADMIN_BASE}/`;
