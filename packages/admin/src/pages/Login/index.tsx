import { LoginPage } from 'shared';

function Login() {
  return (
    <LoginPage
      roles={['admin']}
      homePath="/dashboard"
      onLoginSuccess={(data) => {
        // adminName：后端 admin token 访问不了 user 体系 profile，
        // 顶栏用户名只能登录时存下来
        if (data.username) {
          localStorage.setItem('adminName', data.username);
        }
        // storeid：平台管理员为 0/缺省，商家为店铺 id，
        // Dashboard 按它决定显示 Admin 视图还是 Store 视图
        if (data.storeid !== undefined && data.storeid !== null) {
          localStorage.setItem('storeid', String(data.storeid));
        }
      }}
    />
  );
}

export default Login;
