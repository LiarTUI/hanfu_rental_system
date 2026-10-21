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

// —— Dashboard 图表 1:近 N 天订单与营收趋势(按日期升序、无单日期补零) ——
export interface TrendPoint {
  date: string; // yyyy-MM-dd
  orderCount: number;
  totalAmount: number;
}

export async function getTrend(days = 30) {
  return request<{
    success: boolean;
    data?: TrendPoint[];
    errorMsg?: string;
  }>('/api/admin/stats/trend', { params: { days } });
}

// —— Dashboard 图表 2:订单状态分布(days 不传 = 全部时间) ——
export interface DistItem {
  status: number;
  count: number;
}

export interface DistributionData {
  totalCount: number;
  items: DistItem[];
}

export async function getDistribution() {
  return request<{
    success: boolean;
    data?: DistributionData;
    errorMsg?: string;
  }>('/api/admin/stats/distribution');
}

// —— Dashboard 第二屏:在售商品类目/朝代双维度分布 ——
export interface NamedCount {
  name: string;
  count: number;
}

export interface ProductDistData {
  totalCount: number; // 在售商品 SPU 总数
  categoryItems: NamedCount[];
  dynastyItems: NamedCount[];
}

export async function getProductDist() {
  return request<{
    success: boolean;
    data?: ProductDistData;
    errorMsg?: string;
  }>('/api/admin/stats/product-distribution');
}

// —— Dashboard 第二屏:SKU 成色分布(4 档含 0 全返回) ——
export interface SkuConditionData {
  totalSku: number;
  items: { conditionStatus: number; count: number }[];
}

export async function getSkuCondition() {
  return request<{
    success: boolean;
    data?: SkuConditionData;
    errorMsg?: string;
  }>('/api/admin/stats/sku-condition');
}

// —— Dashboard 第二屏:待办与预警(口径与顶部统计卡同源) ——
export interface TodosData {
  pendingShipCount: number; // 待发货订单
  overdueReturnCount: number; // 逾期归还
  damagingCount: number; // 结算定损中
  defectiveSkuCount: number; // 微瑕/报废 SKU
  lowCreditUserCount: number; // 低信用会员(creditScore<550)
}

export async function getTodos() {
  return request<{
    success: boolean;
    data?: TodosData;
    errorMsg?: string;
  }>('/api/admin/stats/todos');
}

// —— Dashboard 第二屏:热租 TopN(days/limit 可选,后端上限 365/50) ——
export interface HotProduct {
  productId: number;
  name: string;
  storeName: string;
  category: string;
  dynasty: string;
  rentCount: number;
}

export async function getHotProducts(days = 30, limit = 5) {
  return request<{
    success: boolean;
    data?: HotProduct[];
    errorMsg?: string;
  }>('/api/admin/stats/hot-products', { params: { days, limit } });
}
