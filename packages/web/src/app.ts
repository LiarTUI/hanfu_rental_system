// 运行时配置
import {
  createAuthResponseInterceptors,
  tokenRequestInterceptor,
} from 'shared';
import { getProfile } from './services/user';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  try {
    const res = await getProfile();
    return { name: res.username };
  } catch {
    return { name: '未登录' };
  }
}

export const request = {
  requestInterceptors: [tokenRequestInterceptor],
  // 失效登出：登录页挂在根路由
  responseInterceptors: [createAuthResponseInterceptors('/')],
};
