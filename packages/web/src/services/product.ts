import { request } from '@umijs/max';
export const getProductById = (id: string) => {
  return request(`/api/product/${id}`);
};
