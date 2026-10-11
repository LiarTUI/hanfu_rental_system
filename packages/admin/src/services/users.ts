import { request } from '@umijs/max';
export const getAllUsers = () => {
  return request('/api/admin/user/list');
};
