// 对应后端 /api/admin/user/list 返回的用户记录
export type UserData = {
  userId: number;
  username: string;
  phone: string;
  avatar?: string | null; // 相对路径 /api/upload/avatar/xx.jpg
  height?: number; // cm
  weight?: number; // kg
  bodyShape?: string | null; // 体型：梨型/苹果型/沙漏型...
  creditScore?: number; // 信用分（芝麻分式 350~950）
  createTime?: string;
  updateTime?: string;
};
