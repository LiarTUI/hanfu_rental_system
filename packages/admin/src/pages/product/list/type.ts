// 对应后端商品记录（GET /api/admin/product/list）
export type ProductData = {
  id: number;
  storeId: number;
  name: string;
  category: string; // 类目：裙/套装…
  dynasty: string; // 朝代形制：明制/唐制…
  rentPrice: number; // 租金
  deposit: number; // 押金
  coverUrl: string; // 封面图（后端静态资源路径 /api/upload/...）
  status: number; // 1=上架 0=下架
  createTime: string;
  updateTime: string;
};
