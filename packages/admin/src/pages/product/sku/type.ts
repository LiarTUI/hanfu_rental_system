// 对应后端 /api/admin/sku/list 返回的 SKU 记录（ProductSku.java）
// SKU = 仓库里具体的一件衣服：一款商品（product）按尺码/件数拆出的物理件
export type SkuData = {
  id: number;
  productId: number; // 所属商品（SPU），展示时映射为商品名
  skuCode: string; // 水洗标编码，如 ZJ-MMQ-001-M
  size: string; // 尺码：S/M/L/XL...
  conditionStatus: number; // 物理成色，见 CONDITION_STATUS
  createTime: string; // 入库时间
  updateTime: string; // 最近更新（成色变更等）
};

/** 成色 → 文案/颜色（定义见 ProductSku.java L48 注释） */
export const CONDITION_STATUS: Record<number, { text: string; color: string }> =
  {
    1: { text: '全新', color: 'green' }, // 没租出过，或洗护后几乎无穿着痕迹
    2: { text: '良好', color: 'blue' }, // 正常可租标准状态，租过但无瑕疵
    3: { text: '微瑕', color: 'gold' }, // 钩丝/轻微污渍，可租但需降租金/标注
    4: { text: '报废', color: 'red' }, // 不可再出租，等待下架/丢弃/留存
  };
