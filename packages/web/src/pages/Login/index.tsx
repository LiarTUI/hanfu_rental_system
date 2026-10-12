import { LoginPage } from 'shared';

function Login() {
  return <LoginPage roles={['user']} showRegister homePath="/home" />;
}

export default Login;
