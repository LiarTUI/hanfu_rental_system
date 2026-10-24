import { request } from '@umijs/max';
export const getStores = () => {
  return request('/api/admin/store/list');
};

// 新建商家入参：手机号即默认账号，密码由后端设为系统默认值，商家登录后自行修改
export type CreateMerchantParams = {
  phone: string;
  name: string;
  contactName?: string;
  address?: string;
  /** 佣金率，口径 0.12 = 12%；不传由后端取默认值 */
  commissionRate?: number;
};

export const createMerchant = (params: CreateMerchantParams) => {
  return request('/api/admin/store/create', {
    method: 'POST',
    data: params,
  });
};
