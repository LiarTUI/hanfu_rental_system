import { request } from '@umijs/max';
export const getStores = () => {
  return request('/api/store/stores');
};
