import { request } from '@umijs/max';

// Dashboard 聚合统计:一次请求返回所有卡片数字,避免为取 count 拉全量列表
// 环比副标用昨日原始值由前端算百分比,后端新字段未上线时对应副标降级显示 —
export interface StatsData {
  userCount?: number;
  todayNewUsers?: number;
  openStoreCount?: number;
  todayOrderCount?: number;
  todayPlatformCommission?: number;
  todayTotalAmount?: number;
  // —— 以下为 Dashboard 顶部卡片新增字段(后端待上线) ——
  weekNewStoreCount?: number; // 近7天新开且营业中的店铺数
  yesterdayOrderCount?: number; // 昨日订单数(今日订单环比)
  yesterdayNewUsers?: number; // 昨日新增用户数
  yesterdayTotalAmount?: number; // 昨日 GMV
  overdueReturnCount?: number; // 逾期未归还订单数
  updatedAt?: string; // 统计数据生成时间 yyyy-MM-dd HH:mm:ss
}

export async function getStats() {
  return request<{
    success: boolean;
    data?: StatsData;
    errorMsg?: string;
  }>('/api/admin/stats');
}
