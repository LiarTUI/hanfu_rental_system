import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { login } from '../../../services/auth';
import type { formData } from '../type';

interface LoginFormProps {
  role: 'user' | 'admin';
  /** 登录成功 / 已登录时跳转的地址 */
  homePath: string;
  /** 登录成功后的额外副作用，如 admin 端存 adminName/storeid */
  onLoginSuccess?: (data: any) => void;
}

function LoginForm({ role, homePath, onLoginSuccess }: LoginFormProps) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: formData) => {
    setLoading(true);
    try {
      const res = await login(values, role);
      if (res.success) {
        message.success('登录成功！');
        localStorage.setItem('token', res.data.token);
        onLoginSuccess?.(res.data);
        // 整页跳转而非 SPA navigate：admin 的菜单/初始状态在 getInitialState
        // 里拉取，不整页刷新会停留在空菜单的后台
        window.location.href = homePath;
        return;
      }
      message.error(res.errorMsg);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 已登录直接进主页
  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.location.href = homePath;
    }
  }, [homePath]);

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
