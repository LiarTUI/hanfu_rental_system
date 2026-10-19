import { Button, Modal } from 'antd';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

type TabType = 'login' | 'register';

interface LoginModalProps {
  /** 受控开关（由 AuthProvider 持有） */
  open: boolean;
  /** 关闭（点遮罩/X/取消） */
  onClose: () => void;
  /** 登录成功回调：token 已存入 localStorage，data 为接口返回的 data */
  onSuccess?: (data: any) => void;
  /** 打开时默认展示的 tab */
  initialTab?: TabType;
  /** 登录身份，web 用户端固定 'user' */
  role?: 'user' | 'admin';
  /** token 存储的 localStorage key */
  tokenKey?: string;
}

/**
 * 弹窗式登录/注册（web 游客模式的登录入口）。
 * 复用 LoginForm/RegisterForm，整页版 LoginPage 保留给 admin 使用。
 */
function LoginModal({
  open,
  onClose,
  onSuccess,
  initialTab = 'login',
  role = 'user',
  tokenKey = 'token',
}: LoginModalProps) {
  const [tab, setTab] = useState<TabType>(initialTab);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      destroyOnClose
      title={
        <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 600 }}>
          {tab === 'login' ? '欢迎回来' : '注册账号'}
        </div>
      }
    >
      {tab === 'login' ? (
        <LoginForm
          role={role}
          tokenKey={tokenKey}
          onLoginSuccess={(data) => onSuccess?.(data)}
        />
      ) : (
        <RegisterForm
          onBackLogin={() => setTab('login')}
          tokenKey={tokenKey}
          // 后端注册直接返回 token：注册成功即登录，与登录成功走同一出口
          onRegisterSuccess={(data) => onSuccess?.(data)}
        />
      )}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        {tab === 'login' ? (
          <Button type="link" size="small" onClick={() => setTab('register')}>
            没有账号？点击注册
          </Button>
        ) : (
          <Button type="link" size="small" onClick={() => setTab('login')}>
            已有账号，返回登录
          </Button>
        )}
      </div>
    </Modal>
  );
}

export { LoginModal };
export type { LoginModalProps };
