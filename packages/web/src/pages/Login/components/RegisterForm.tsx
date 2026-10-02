import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { register } from '../../../services/user';
import type { formData } from '../type';

interface RegisterFormProps {
  onBackLogin: () => void;
}

function RegisterForm({ onBackLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);

  const onRegister = async (values: formData) => {
    setLoading(true);
    try {
      // surePassword 只用于前端校验，不发给后端
      const { surePassword, ...params } = values;
      const res = await register(params);
      if (res.success) {
        message.success('注册成功！');
        onBackLogin();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onRegister} name="register">
      <Form.Item
        name="account"
        rules={[{ required: true, message: '请输入账号' }]}
      >
        <Input placeholder="请输入账号" autoComplete="username"></Input>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少 6 位' },
        ]}
      >
        <Input.Password
          placeholder="请输入密码"
          autoComplete="new-password"
        ></Input.Password>
      </Form.Item>
      <Form.Item
        name="surePassword"
        dependencies={['password']}
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value)
                return Promise.resolve();
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="确认密码"
          autoComplete="new-password"
        ></Input.Password>
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
        ]}
      >
        <Input placeholder="请输入手机号" maxLength={11}></Input>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
        >
          注册
        </Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
