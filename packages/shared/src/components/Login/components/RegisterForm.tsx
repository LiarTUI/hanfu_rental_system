import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { register } from '../../../services/auth';
import type { formData } from '../type';

interface RegisterFormProps {
  /** 点击"返回登录"时的回调（Modal 场景切换回登录 tab，整页场景切回登录 tab） */
  onBackLogin: () => void;
  /**
   * 注册成功回调。后端注册接口直接返回 token，注册成功即登录态
   * （token 已存入 localStorage），回调后无需再回登录框。
   */
  onRegisterSuccess?: (data: any) => void;
  /** token 存储的 localStorage key，注册自动登录时使用 */
  tokenKey?: string;
}

function RegisterForm({
  onBackLogin,
  onRegisterSuccess,
  tokenKey = 'token',
}: RegisterFormProps) {
  const [loading, setLoading] = useState(false);

  const onRegister = async (values: formData) => {
    setLoading(true);
    try {
      // surePassword 只用于前端校验，不发给后端
      const { surePassword, ...params } = values;
      const res = await register(params);
      if (res.success) {
        // 后端注册返回 token：直接进入登录态，无需再登录
        if (res.data?.token && tokenKey) {
          localStorage.setItem(tokenKey, res.data.token);
          message.success('注册成功，已自动登录！');
          onRegisterSuccess?.(res.data);
          return;
        }
        message.success('注册成功！');
        onRegisterSuccess?.(res.data);
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
