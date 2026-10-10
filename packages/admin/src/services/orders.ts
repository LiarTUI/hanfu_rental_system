import { request } from '@umijs/max';
export const getAllOrders = () => {
  return request('/api/admin/order/list');
};
