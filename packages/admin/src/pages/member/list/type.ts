// 对应后端 /api/admin/user/list 返回的用户记录
export type UserData = {
  userId: number;
  username: string;
  phone: string;
  avatar?: string | null; // 相对路径 /api/upload/avatar/xx.jpg
  height?: number; // cm
  weight?: number; // kg
  bust?: number; // 胸围 cm
  waist?: number; // 腰围 cm
  hip?: number; // 臀围 cm
  bodyShape?: string | null; // 体型：梨型/苹果型/沙漏型...
  creditScore?: number; // 信用分（芝麻分式 350~950）
  status?: number; // 账号状态，枚举待后端确认，暂按 1=正常 0=停用
  lastLoginTime?: string; // 最近登录时间
  createTime?: string;
  updateTime?: string;
};
