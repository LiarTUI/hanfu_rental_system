// 运行时配置
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Button, Modal } from 'antd';
import {
  createAuthResponseInterceptors,
  createTokenRequestInterceptor,
} from 'shared';
import { ADMIN_BASE, ADMIN_TOKEN_KEY, LOGIN_URL } from './constants';
import { getSysMenu } from './services/sys_menu';

interface AdminInitialState {
  name: string;
  menuPaths: string[];
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
export async function getInitialState(): Promise<AdminInitialState> {
  // 未登录直接送回登录页（登录页自身除外）；token 失效场景由 401 拦截器兜底
  if (!localStorage.getItem(ADMIN_TOKEN_KEY)) {
    if (window.location.pathname !== LOGIN_URL) {
      window.location.replace(LOGIN_URL);
    }
    return { name: '', menuPaths: [] };
  }
  // 后端 JWT 区分 user/admin 角色，admin token 访问不了 /api/user/profile，
  // 用户名在登录成功时存进 adminName；拿不到时回退默认名
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
  // admin_token：与 web 的 token key 隔离，同域部署互不覆盖
  requestInterceptors: [createTokenRequestInterceptor(ADMIN_TOKEN_KEY)],
  // 失效登出：踢回 admin 自己的登录页
  responseInterceptors: [
    createAuthResponseInterceptors(LOGIN_URL, ADMIN_TOKEN_KEY),
  ],
};

export const layout: RunTimeLayoutConfig = () => {
  return {
    // 生产环境挂在 /admin 前缀下，public 里的静态资源路径要带上前缀
    logo: `${ADMIN_BASE}/manageLogo.svg`,
    logout: () => {
      Modal.confirm({
        title: '确认退出登录？',
        content: '退出后返回登录页',
        okText: '退出',
        cancelText: '取消',
        onOk: () => {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          localStorage.removeItem('adminName');
          localStorage.removeItem('storeid');
          window.location.href = LOGIN_URL;
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
