import { request } from '@umijs/max';

// 对应后端 Orders.java 实体 + C 端订单接口（POST /api/order 等，后端本轮排期开发）
// 商品信息（名称/封面/尺码）需后端联表返回；字段名对齐后端后如有出入以实际为准
export type MyOrderData = {
  id: number;
  orderNo: string;
  // 0待支付/1待发货/2租赁中/3待归还/4结算定损中/5已完成/6已退款关闭
  status: number;
  rentStartDate: string;
  rentEndDate: string;
  totalAmount: number; // 应付总额（租金 + 洗涤费）
  depositAmount: number; // 押金
  trackingNoSend: string | null;
  trackingNoReturn: string | null;
  createTime: string;
  // 以下为联表商品信息（后端联表后返回，前端已做缺省兜底）
  productId?: number;
  productName?: string;
  productCover?: string;
  size?: string;
};

// 我的订单列表（需登录，token 由拦截器注入）
export const getMyOrders = () => {
  return request<{ success: boolean; data?: MyOrderData[] }>('/api/order/my');
};

// 下单：金额后端算（租金×天数 + 洗涤费 + 押金），productId 由 skuId 反查故不传
// 后端校验：SKU 档期冲突 / 商品上架 / minRentPeriod
// 返回 data 含订单 id（支付用），失败 errorMsg 为档期冲突等业务原因
export const createOrder = (data: {
  skuId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}) => {
  return request<{
    success: boolean;
    data?: { id: number };
    errorMsg?: string;
  }>('/api/order', { method: 'POST', data });
};

// 模拟支付：0 待支付 → 1 待发货（后续接支付宝只换此实现）
export const payOrder = (id: number) => {
  return request<{ success: boolean; errorMsg?: string }>(
    `/api/order/${id}/pay`,
    { method: 'POST' },
  );
};

// 取消订单（限待支付；取消后状态 → 6 已退款关闭）
export const cancelOrder = (id: number) => {
  return request<{ success: boolean; errorMsg?: string }>(
    `/api/order/${id}/cancel`,
    { method: 'POST' },
  );
};

// 发起归还：填归还快递单号，状态 2 租赁中/3 待归还 → 4 结算定损中
export const returnOrder = (id: number, trackingNoReturn: string) => {
  return request<{ success: boolean; errorMsg?: string }>(
    `/api/order/${id}/return`,
    { method: 'POST', data: { trackingNoReturn } },
  );
};
