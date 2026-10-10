import { useNavigate } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { ADMIN_HOME } from 'shared';
import { login } from '../../../services/user';
import type { formData } from '../type';

interface LoginFormProps {
  role: 'user' | 'admin';
}

function LoginForm({ role }: LoginFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: formData) => {
    setLoading(true);
    try {
      const res = await login(values, role);
      if (res.success) {
        message.success('登录成功！');
        if (role === 'admin') {
          console.log(res);
          // 后端没有 admin 档案查询接口，用户名随 token 一起接力给后台显示
          const params = new URLSearchParams({
            token: res.data.token,
            storeid: res.data.storeid,
            ...(res.data.username ? { name: res.data.username } : {}),
          });
          window.location.href = `${ADMIN_HOME}?${params.toString()}`;
          return;
        }
        localStorage.setItem('token', res.data.token);
        navigate('/home', { replace: true });
        return;
      }
      message.error(res.errorMsg);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);
  return (
    <Form onFinish={onFinish} name={`login-${role}`}>
      <Form.Item
        name="account"
        rules={[
          {
            required: true,
            message: role === 'admin' ? '请输入管理员/商家账号' : '请输入账号',
          },
        ]}
      >
        <Input
          placeholder={
            role === 'admin' ? '请输入管理员/商家账号' : '请输入账号'
          }
          autoComplete="username"
        ></Input>
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
