// 运行时配置
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Button, Modal } from 'antd';
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
  // 接收用户端登录页跨端口交接来的 token 和用户名：存进 8002 自己的存储，随后把地址栏清理干净
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const relayName = params.get('name');
  if (token) {
    localStorage.setItem('token', token);
    if (relayName) {
      localStorage.setItem('adminName', relayName);
    }
    params.delete('token');
    params.delete('name');
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}`,
    );
  }
  // 后端 JWT 区分 user/admin 角色，admin token 访问不了 /api/user/profile，
  // 用户名由登录页接力带过来；拿不到时回退默认名
  const name = localStorage.getItem('adminName') || 'Admin';
  try {
    const res: any = await getSysMenu();
    const list: any[] = Array.isArray(res?.data) ? res.data : [];
    const menuPaths = list
      .map((m) => (typeof m === 'string' ? m : m?.path))
      .filter(Boolean);
    return { name, menuPaths };
  } catch {
    return { name, menuPaths: [] };
  }
}

export const request = {
  requestInterceptors: [tokenRequestInterceptor],
  // 失效登出：admin 自己没有登录页，统一踢回用户端登录页
  responseInterceptors: [createAuthResponseInterceptors(WEB_LOGIN)],
};

export const layout: RunTimeLayoutConfig = () => {
  return {
    logout: () => {
      Modal.confirm({
        title: '确认退出登录？',
        content: '退出后返回登录页',
        okText: '退出',
        cancelText: '取消',
        onOk: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('adminName');
          window.location.href = WEB_LOGIN;
        },
      });
    },
    waterMarkProps: { content: '华衿后台' },
    layout: 'mix',
    rightContentRender: (headerProps, dom) => (
      <>
        {dom} {/* dom = umi 默认那份:头像+名字+退出 dropdown */}
        <Button>帮助</Button> {/* 自己追加的元素,排在它右边 */}
      </>
    ),
    siderWidth: 240,
  };
};
