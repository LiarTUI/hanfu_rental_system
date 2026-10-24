import { request } from '@umijs/max';
export const getProductById = (id: string) => {
  return request(`/api/product/${id}`);
};

// 市集商品列表：仅上架且审核通过的商品
// params.startDate/endDate（YYYY-MM-DD，可选）：传入时后端逐商品校验该区间档期，
// 返回 available=false 的商品前端显示"当前档期已约满"
export const getMarketProducts = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return request('/api/product/market', { params });
};
