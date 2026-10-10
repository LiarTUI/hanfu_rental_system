import { request } from '@umijs/max';

// Dashboard 聚合统计:一次请求返回所有卡片数字,避免为取 count 拉全量列表
export interface StatsData {
  userCount?: number;
  todayNewUsers?: number;
  openStoreCount?: number;
  todayOrderCount?: number;
  todayPlatformCommission?: number;
  todayTotalAmount?: number;
}

export async function getStats() {
  return request<{
    success: boolean;
    data?: StatsData;
    errorMsg?: string;
  }>('/api/admin/stats');
}
