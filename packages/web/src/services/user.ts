import { request } from '@umijs/max';

// 登陆
export async function login(
  params: { account: string; password: string },
  type: string,
) {
  const address = `/api/${type}/login`;
  return request<any>(address, {
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

//根据用户token获取用户信息
export async function getProfile() {
  return request<any>('/api/user/profile');
}

// 上传头像，后端存储后返回新头像地址
export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<{
    success: boolean;
    data?: { avatar: string };
    errorMsg?: string;
  }>('/api/user/avatar', {
    method: 'POST',
    data: formData, // FormData 直接传，request 会自动带 multipart 请求头
  });
}
