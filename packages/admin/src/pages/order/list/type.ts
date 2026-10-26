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

// 订单状态映射统一取自 shared（与 web 端共用，避免双份漂移）
export { ORDER_STATUS } from 'shared';
export type { OrderStatusInfo } from 'shared';

// 用户评价（订单详情弹窗内嵌展示；字段待后端确认，暂按通用评价结构）
export type ReviewData = {
  reviewId: number;
  orderId: number;
  rating: number; // 1~5 星
  content: string | null; // 评价内容
  createTime: string;
};
