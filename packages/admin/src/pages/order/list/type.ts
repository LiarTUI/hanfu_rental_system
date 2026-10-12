// 对应后端 Orders.java（接口已有：GET /api/admin/order/list）
// isDeleted 不在其中：@TableLogic 逻辑删除，前端拿不到 is_deleted=1 的数据
export type OrderData = {
  id: number;
  userId: number;
  storeId: number;
  orderNo: string;
  // 0待支付/1待发货/2租赁中/3待归还/4结算定损中/5已完成/6已退款关闭
  status: number;
  createTime: string;
  updateTime: string;
  rentStartDate: string;
  rentEndDate: string;
  totalAmount: number; // 租金总额（实付）
  depositAmount: number; // 押金总额
  platformCommission: number; // 平台抽成
  merchantIncome: number; // 商家实际入账
  trackingNoSend: string | null; // 发货物流单号，null = 待发货
  trackingNoReturn: string | null; // 退回物流单号（归还阶段才有）
};

/** 订单状态 → 展示文案/颜色 */
export const ORDER_STATUS: Record<number, { text: string; color: string }> = {
  0: { text: '待支付', color: 'default' },
  1: { text: '待发货', color: 'orange' },
  2: { text: '租赁中', color: 'blue' },
  3: { text: '待归还', color: 'purple' },
  4: { text: '结算定损中', color: 'gold' },
  5: { text: '已完成', color: 'green' },
  6: { text: '已退款关闭', color: 'red' },
};
