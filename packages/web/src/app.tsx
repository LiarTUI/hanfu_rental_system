// 运行时配置（游客模式）
import type { ReactNode } from 'react';
import {
  AuthProvider,
  createAuthResponseInterceptors,
  tokenRequestInterceptor,
} from 'shared';
import { getProfile } from './services/user';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  // 游客不请求 profile：进站即逛，避免每次加载都白挨一个注定失败的 401
  if (!localStorage.getItem('token')) return { name: '' };
  try {
    const res = await getProfile();
    // 用户信息嵌在后端响应的 data 字段里
    return { name: res?.data?.username ?? '' };
  } catch {
    return { name: '' };
  }
}

export const request = {
  requestInterceptors: [tokenRequestInterceptor],
  // 登录态失效不再跳页面：清 token 后派发事件，由 AuthProvider 弹登录 Modal
  responseInterceptors: [
    createAuthResponseInterceptors('/', 'token', () =>
      window.dispatchEvent(new CustomEvent('auth:expired')),
    ),
  ],
};

// 把 AuthProvider 包到 React 树根部：任意页面 useAuth() 拿登录态与登录弹窗入口
export function rootContainer(container: ReactNode) {
  return <AuthProvider fetchUser={getProfile}>{container}</AuthProvider>;
}
