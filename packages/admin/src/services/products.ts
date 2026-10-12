import { request } from '@umijs/max';

// 商品列表(接口返回 data 为 ProductData[],字段与后端商品实体对齐)
export const getAllProducts = () => {
  return request('/api/admin/product/list');
};
