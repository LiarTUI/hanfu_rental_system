import { request } from '@umijs/max';

// 商品列表(接口返回 data 为 ProductData[],字段与后端商品实体对齐)
export const getAllProducts = () => {
  return request('/api/admin/product/list');
};

// SKU 台账（GET /api/admin/sku/list）
// 两参数都可选：不传返回全部，按入库时间倒序
export const getSkus = (params?: {
  productId?: number;
  condition?: number;
}) => {
  return request('/api/admin/sku/list', { params });
};
