// 获取当前账号下的菜单栏
import { request } from '@umijs/max';
export async function getSysMenu() {
  return request<any>('/api/admin/menus');
}
