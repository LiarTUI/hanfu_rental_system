// 对应后端店铺记录（GET /api/store/list）
export type StoreData = {
  id: number;
  name: string;
  contactName: string; // 联系人
  contactPhone: string; // 联系电话
  address: string;
  commissionRate: number; // 平台佣金率，0.10 = 10%
  status: number; // 1=营业中 0=离线
  createTime: string;
  updateTime: string;
};
