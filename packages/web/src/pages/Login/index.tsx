import { Image, Layout } from 'antd';
import { useState } from 'react';
import logo from '../../assets/logo.svg';
import logo1 from '../../assets/logo1.svg';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import styles from './index.less';
type LoginType = 'user' | 'admin' | 'register';

function Login() {
  const [type, setType] = useState<LoginType>('user');

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
              <div
                className={`${styles.slider} ${
                  type === 'admin' ? styles.sliderRight : ''
                }`}
                style={{ display: type === 'register' ? 'none' : '' }}
              />
              <div
                className={`${styles.loginTab} ${
                  type === 'user' ? styles.loginTabActive : ''
                }`}
                style={{ display: type === 'register' ? 'none' : '' }}
                onClick={() => setType('user')}
              >
                <span>用户登陆</span>
              </div>
              <div
                className={`${styles.loginTab} ${
                  type === 'admin' ? styles.loginTabActive : ''
                }`}
                style={{ display: type === 'register' ? 'none' : '' }}
                onClick={() => setType('admin')}
              >
                <span>管理员/商家登陆</span>
              </div>
            </div>

            {/* 三个不同组件，切换时 React 销毁重建，表单数据天然隔离，无残留 */}
            {type === 'user' && <LoginForm role="user" />}
            {type === 'admin' && <LoginForm role="admin" />}
            {type === 'register' && (
              <RegisterForm onBackLogin={() => setType('user')} />
            )}

            <div
              className={styles.register}
              onClick={() => setType('register')}
              style={{ display: type === 'register' ? 'none' : '' }}
            >
              <span>没有账号？</span>
              <span>点击注册</span>
            </div>
            <div
              className={styles.register}
              onClick={() => setType('user')}
              style={{ display: type === 'register' ? '' : 'none' }}
            >
              <span>返回登陆</span>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Login;
