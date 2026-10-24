// 对应后端商品记录（GET /api/admin/product/list）
export type ProductData = {
  id: number;
  storeId: number;
  name: string;
  category: string; // 类目：裙/套装…
  dynasty: string; // 朝代形制：明制/唐制…
  color: string; // 颜色
  description: string; // 商品描述（长文本，详情展示）
  rentPrice: number; // 租金
  rentUnit: number; // 租金单位，枚举待后端确认，暂按 1=天
  minRentPeriod: number; // 起租期（单位同 rentUnit）
  deposit: number; // 押金
  cleaningFee: number; // 洗涤费
  stock: number; // 库存
  suitableBodyShape: string; // 适合体型，逗号分隔：标准型,梨型…
  suitableHeightMin: number; // 适合身高下限 cm
  suitableHeightMax: number; // 适合身高上限 cm
  coverUrl: string; // 封面图（后端静态资源路径 /api/upload/...）
  status: number; // 1=上架 0=下架
  rating: number | null; // 商品评分（如 4.0），null=暂无评分
  reviewCount: number; // 评价数
  auditStatus: number; // 审核状态，枚举待后端确认，暂按 0=待审核 1=审核通过 2=审核驳回
  auditRemark: string | null; // 审核备注（驳回原因），null=无
  createTime: string;
  updateTime: string;
};

/** 审核状态 → 展示文案/颜色（枚举待后端确认） */
export const AUDIT_STATUS: Record<number, { text: string; color: string }> = {
  0: { text: '待审核', color: 'orange' },
  1: { text: '审核通过', color: 'green' },
  2: { text: '审核驳回', color: 'red' },
};

/** 租金单位 → 展示文案（枚举待后端确认） */
export const RENT_UNIT: Record<number, string> = {
  1: '天',
};
