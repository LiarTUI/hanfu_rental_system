import { request } from '@umijs/max';

// 登录/注册接口已迁至 shared/src/services/auth.ts，由 Login 组件内部调用

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
