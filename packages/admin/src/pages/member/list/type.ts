// 对应后端 /api/admin/user/list 返回的用户记录
export type UserData = {
  userId: number;
  username: string;
  phone: string;
  avatar?: string | null;
  createTime?: string;
};
