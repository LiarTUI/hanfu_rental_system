// 对应后端店铺记录（接口已有：GET /api/store/list）
export type StoreData = {
  id: number;
  name: string;
  address: string;
  status: number; // 1=营业中 0=离线
  createTime: string;
};
