import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { login } from '../../../services/auth';
import type { formData } from '../type';

interface LoginFormProps {
  role: 'user' | 'admin';
  /**
   * 整页登录模式专用：登录成功跳转的地址。
   * 不传（Modal 场景）则只存 token + 回调 onLoginSuccess，不做任何跳转。
   */
  homePath?: string;
  /** token 存储的 localStorage key，同域部署时 web/admin 隔离用 */
  tokenKey?: string;
  /** 登录成功后的回调（token 已存入 localStorage），data 为接口返回的 data */
  onLoginSuccess?: (data: any) => void;
}

function LoginForm({
  role,
  homePath,
  tokenKey = 'token',
  onLoginSuccess,
}: LoginFormProps) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: formData) => {
    setLoading(true);
    try {
      const res = await login(values, role);
      if (res.success) {
        message.success('登录成功！');
        localStorage.setItem(tokenKey, res.data.token);
        onLoginSuccess?.(res.data);
        // 整页模式才整页跳转而非 SPA navigate：
        // admin 的菜单/初始状态在 getInitialState 里拉取，不整页刷新会停留在空菜单的后台
        if (homePath) {
          window.location.href = homePath;
        }
        return;
      }
      message.error(res.errorMsg);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 整页模式的兜底：已登录直接进主页（Modal 场景由 AuthProvider 控制开关，不需要）
  useEffect(() => {
    if (homePath && localStorage.getItem(tokenKey)) {
      window.location.href = homePath;
    }
  }, [homePath, tokenKey]);

  return (
    <Form onFinish={onFinish} name={`login-${role}`}>
      <Form.Item
        name="account"
        rules={[
          {
            required: true,
            message: '请输入账号',
          },
        ]}
      >
        <Input placeholder={'请输入账号'} autoComplete="username"></Input>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          placeholder="请输入密码"
          autoComplete="current-password"
        ></Input.Password>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
