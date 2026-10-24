import { request } from '@umijs/max';
export const getAllOrders = () => {
  return request('/api/admin/order/list');
};

// 按订单查用户评价（原独立"用户评价"页面已并入订单详情弹窗）
// 返回字段以 @/pages/order/list/type.ts 的 ReviewData 为准
export const getReviewsByOrder = (orderId: number) => {
  return request('/api/admin/review/list', {
    params: { orderId },
  });
};
