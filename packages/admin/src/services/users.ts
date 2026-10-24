import { request } from '@umijs/max';
export const getAllUsers = () => {
  return request('/api/admin/user/list');
};

// 封禁/解封用户：status 1=正常 0=封禁
export const updateUserStatus = (userId: number, status: 0 | 1) => {
  return request('/api/admin/user/status', {
    method: 'POST',
    data: { userId, status },
  });
};
