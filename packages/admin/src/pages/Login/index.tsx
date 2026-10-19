import { ADMIN_BASE, ADMIN_TOKEN_KEY } from '@/constants';
import { LoginPage } from 'shared';

function Login() {
  return (
    <LoginPage
      roles={['admin']}
      homePath={`${ADMIN_BASE}/dashboard`}
      tokenKey={ADMIN_TOKEN_KEY}
      onLoginSuccess={(data) => {
        // adminName：后端 admin token 访问不了 user 体系 profile，
        // 顶栏用户名只能登录时存下来
        if (data.username) {
          localStorage.setItem('adminName', data.username);
        }
        // storeId：平台管理员为 0/缺省，商家为店铺 id，
        // Dashboard 按它决定显示 Admin 视图还是 Store 视图
        // （后端字段为驼峰 storeId，见 /admin/login 响应 data）
        if (data.storeId !== undefined && data.storeId !== null) {
          localStorage.setItem('storeid', String(data.storeId));
        }
      }}
    />
  );
}

export default Login;
