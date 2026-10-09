// 运行时配置
import type { RunTimeLayoutConfig } from '@umijs/max';
import {
  WEB_LOGIN,
  createAuthResponseInterceptors,
  tokenRequestInterceptor,
} from 'shared';
import { getSysMenu } from './services/sys_menu';

interface AdminInitialState {
  name: string;
  menuPaths: string[];
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
export async function getInitialState(): Promise<AdminInitialState> {
  // 接收用户端登录页跨端口交接来的 token：存进 8002 自己的存储，随后把地址栏清理干净
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    params.delete('token');
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}`,
    );
  }
  try {
    const res: any = await getSysMenu();
    const list: any[] = Array.isArray(res?.data) ? res.data : [];
    const menuPaths = list
      .map((m) => (typeof m === 'string' ? m : m?.path))
      .filter(Boolean);
    return { name: 'Admin', menuPaths };
  } catch {
    return { name: 'Admin', menuPaths: [] };
  }
}

export const request = {
  requestInterceptors: [tokenRequestInterceptor],
  // 失效登出：admin 自己没有登录页，统一踢回用户端登录页
  responseInterceptors: [createAuthResponseInterceptors(WEB_LOGIN)],
};

export const layout: RunTimeLayoutConfig = () => {
  console.log(
    '[admin layout] runtime config applied, logout:',
    typeof (() => {}),
  );
  return {
    logout: () => {
      localStorage.removeItem('token');
      window.location.href = WEB_LOGIN;
    },
  };
};
