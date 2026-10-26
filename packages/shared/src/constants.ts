export const APP_NAME = 'BS';

export const API_PREFIX = '/api';

// ========== 订单状态（与后端 Orders.java 实体注释一致，web/admin 共用） ==========
// 0待支付/1待发货/2租赁中/3待归还/4结算定损中/5已完成/6已退款关闭
export type OrderStatusInfo = { text: string; color: string };
export const ORDER_STATUS: Record<number, OrderStatusInfo> = {
  0: { text: '待支付', color: 'default' },
  1: { text: '待发货', color: 'orange' },
  2: { text: '租赁中', color: 'blue' },
  3: { text: '待归还', color: 'purple' },
  4: { text: '结算定损中', color: 'gold' },
  5: { text: '已完成', color: 'green' },
  6: { text: '已退款关闭', color: 'red' },
};

// SKU 成色（与后端 conditionStatus 实体注释一致）
// 1全新/2良好/3微瑕/4报废（报废不可租，前端选择器需过滤）
export const SKU_CONDITION: Record<number, { text: string; color: string }> = {
  1: { text: '全新', color: '#52a35a' },
  2: { text: '良好', color: '#3b7ea9' },
  3: { text: '微瑕', color: '#c08a2d' },
  4: { text: '报废', color: '#999999' },
};
