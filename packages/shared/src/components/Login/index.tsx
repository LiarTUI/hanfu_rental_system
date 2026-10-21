import { Image, Layout } from 'antd';
import { useState } from 'react';
import logo from './assets/logo.svg';
import logo1 from './assets/logo1.svg';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import styles from './index.less';

type LoginRole = 'user' | 'admin';
type TabType = 'user' | 'admin' | 'register';

interface LoginPageProps {
  /** 展示哪些登录身份 tab：web 传 ['user']，admin 传 ['admin'] */
  roles: LoginRole[];
  /** 默认选中的身份，不传取 roles[0] */
  defaultRole?: LoginRole;
  /** 是否展示注册入口（仅 web 需要） */
  showRegister?: boolean;
  /** 登录成功 / 已登录时跳转的地址 */
  homePath: string;
  /** 登录成功后的额外副作用，如 admin 端存 adminName/storeid */
  onLoginSuccess?: (data: any, role: LoginRole) => void;
  /** token 存储的 localStorage key，同域部署时 web/admin 需不同 key 隔离 */
  tokenKey?: string;
}

function LoginPage({
  roles,
  defaultRole,
  showRegister = false,
  homePath,
  onLoginSuccess,
  tokenKey = 'token',
}: LoginPageProps) {
  const [type, setType] = useState<TabType>(defaultRole ?? roles[0]);
  const singleRole = roles.length === 1;

  return (
    <Layout>
      <Layout.Header className={styles.header}>
        <Image src={logo} preview={false}></Image>
      </Layout.Header>
      <Layout.Content className={styles.color}>
        <div className={styles.contentLogo}>
          <Image src={logo1} preview={false}></Image>
        </div>
        <div className={styles.loginPage}>
          <div className={styles.loginCard}>
            <div
              className={styles.loginTabs}
              style={{ background: type !== 'register' ? '#f2f3f5' : '#fff' }}
            >
              <div
                className={styles.registerText}
                style={{ display: type === 'register' ? '' : 'none' }}
              >
                <span>注册</span>
              </div>
            </div>

            {/* 不同身份不同组件，切换时 React 销毁重建，表单数据天然隔离，无残留 */}
            {type === 'user' && (
              <LoginForm
                role="user"
                homePath={homePath}
                tokenKey={tokenKey}
                onLoginSuccess={(data) => onLoginSuccess?.(data, 'user')}
              />
            )}
            {type === 'admin' && (
              <LoginForm
                role="admin"
                homePath={homePath}
                tokenKey={tokenKey}
                onLoginSuccess={(data) => onLoginSuccess?.(data, 'admin')}
              />
            )}
            {type === 'register' && (
              <RegisterForm
                onBackLogin={() => setType(roles[0])}
                tokenKey={tokenKey}
                // 后端注册直接返回 token：注册成功即登录态，直接进首页
                onRegisterSuccess={() => {
                  window.location.href = homePath;
                }}
              />
            )}

            {showRegister && type !== 'register' && (
              <div
                className={styles.register}
                onClick={() => setType('register')}
              >
                <span>没有账号？</span>
                <span>点击注册</span>
              </div>
            )}
            {type === 'register' && (
              <div
                className={styles.register}
                onClick={() => setType(roles[0])}
              >
                <span>返回登陆</span>
              </div>
            )}
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export { LoginPage };
export type { LoginPageProps, LoginRole };
// Modal 场景（web 游客模式登录入口）与整页版共用同一套表单
export { default as LoginForm } from './components/LoginForm';
export { LoginModal } from './LoginModal';
export type { LoginModalProps } from './LoginModal';
