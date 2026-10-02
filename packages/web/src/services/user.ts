import { request } from '@umijs/max';

// 登陆
export async function login(
  params: { account: string; password: string },
  type: string,
) {
  const address = `/api/${type}/login`;
  return request<{ success: boolean; errorMsg?: string }>(address, {
    method: 'POST',
    data: params,
  });
}

// 注册
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
