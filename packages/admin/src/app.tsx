// 运行时配置
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Dropdown } from 'antd';
import { WEB_LOGIN } from 'shared';
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

  // 拉取当前账号的菜单路径，供 src/access.ts 计算侧边栏显隐
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
  requestInterceptors: [
    (url: string, options: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { url, options };
    },
  ],
  responseInterceptors: [
    (response: any) => {
      const { status, config, data } = response;
      const url = typeof config?.url === 'string' ? config.url : '';
      const msg: string = data?.errorMsg ?? '';
      // 鉴权类失败才登出：401、token 对应用户已不存在、token 失效
      const tokenInvalid =
        status === 401 ||
        msg.includes('用户不存在') ||
        msg.includes('token失效');
      // 登录接口的"用户不存在"是账号输错，不当作登录态失效
      const isLoginApi = url.includes('/login');
      if (tokenInvalid && !isLoginApi && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = WEB_LOGIN;
      }
      return response;
    },
  ],
};

// 运行时 Layout 配置：头像区（icon + name）在此定制，加交互用 Dropdown 包一层
export const layout: RunTimeLayoutConfig = ({ initialState }) => ({
  avatarProps: {
    icon: <UserOutlined />,
    title: initialState?.name ?? 'Admin',
    size: 'small',
    render: (_props, dom) => (
      <Dropdown
        menu={{
          items: [
            { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
          ],
          onClick: ({ key }) => {
            if (key === 'logout') {
              localStorage.removeItem('token');
              window.location.href = WEB_LOGIN;
            }
          },
        }}
      >
        {dom}
      </Dropdown>
    ),
  },
});
