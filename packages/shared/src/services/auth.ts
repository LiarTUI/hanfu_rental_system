import { request } from '@umijs/max';

// 登录：user/admin 共用同一表单，请求路径按身份区分
export async function login(
  params: { account: string; password: string },
  type: 'user' | 'admin',
) {
  const address = `/api/${type}/login`;
  return request<any>(address, {
    method: 'POST',
    data: params,
  });
}

// 注册：仅用户端使用
export async function register(params: {
  account: string;
  password: string;
  phone?: string;
}) {
  return request<{ success: boolean; errorMsg?: string }>(
    '/api/user/register',
    {
      method: 'POST',
      data: params,
    },
  );
}
