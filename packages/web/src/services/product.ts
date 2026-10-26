import { request } from '@umijs/max';
export const getProductById = (id: string) => {
  return request(`/api/product/${id}`);
};

// ========== 市集商品（GET /api/product/market，首页「档期良选」复用） ==========
// heat 后端暂未提供时由前端按 rating/reviewCount 折算兜底；
// available=false → 卡片灰化并显示「当前档期已约满」，选定租赁档期后该卡被滤除
// featured → 左上角显示红色「镇店良裁」角标
export interface MarketProduct {
  id: number;
  name: string;
  rentPrice: number; // 日租金
  rentUnit?: number; // 租金单位，1=天
  dynasty: string; // 宋制 / 晋制 / 唐制 / 明制
  category: string; // 外搭 / 下装 / 男装 / 步摇...
  storeId: number;
  storeName?: string; // 店铺名，接口暂未返回时显示占位
  coverUrl?: string;
  stock?: number;
  rating?: number | null;
  reviewCount?: number;
  heat: number; // 热度（排序用）
  available?: boolean; // 选定档期内是否可租（后端档期校验）
  featured?: boolean;
}

// 市集商品列表：仅上架且审核通过的商品
// params.startDate/endDate（YYYY-MM-DD，可选）：传入时后端逐商品校验该区间档期，
// 返回 available=false 的商品前端显示"当前档期已约满"
export const getMarketProducts = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return request('/api/product/market', { params });
};
