// 两端共用的请求拦截器：token 注入 + 登录态失效自动登出

/**
 * token 注入拦截器工厂：tokenKey 指定从哪个 localStorage key 取 token。
 * web/admin 同域部署时共用 localStorage，需用不同 key 隔离登录态。
 */
export const createTokenRequestInterceptor = (tokenKey = 'token') => {
  return (url: string, options: any) => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return { url, options };
  };
};

/** 默认 key（'token'）的成品拦截器，web 端直接使用 */
export const tokenRequestInterceptor = createTokenRequestInterceptor();

/** 判断并执行失效登出：清 token 后跳转登录页（或派发失效事件） */
const handleAuthFailure = (
  loginUrl: string,
  tokenKey: string,
  status?: number,
  url?: string,
  errorMsg?: string,
  onAuthExpired?: () => void,
) => {
  // 鉴权类失败才登出：401、token 对应用户已不存在、token 失效
  const tokenInvalid =
    status === 401 ||
    (errorMsg ?? '').includes('用户不存在') ||
    (errorMsg ?? '').includes('token失效');
  // 登录接口的"用户不存在"是账号输错，不当作登录态失效
  const isLoginApi = (url ?? '').includes('/login');
  if (tokenInvalid && !isLoginApi && localStorage.getItem(tokenKey)) {
    localStorage.removeItem(tokenKey);
    // 事件模式（web 游客模式）：不跳页面，由 AuthProvider 监听后弹登录 Modal
    if (onAuthExpired) {
      onAuthExpired();
    } else {
      window.location.href = loginUrl;
    }
  }
};

/**
 * 失效登出响应拦截器工厂。
 * - loginUrl：跳转模式的登录页地址（onAuthExpired 未传时生效）
 * - tokenKey：本地 token 的 localStorage key
 * - onAuthExpired：失效回调（事件模式），传了则不跳页面（如派发 auth:expired
 *   事件给 AuthProvider 弹登录 Modal），适合游客可浏览的 SPA
 * 返回 [成功分支, 失败分支]：成功分支处理 200 + errorMsg 的业务级失效，
 * 失败分支处理 HTTP 401 —— axios 对 4xx 走 rejection 路径，
 * 只注册成功分支的话 401 永远拦不到（umi 源码里数组形式才会挂上第二个参数）。
 */
export const createAuthResponseInterceptors = (
  loginUrl: string,
  tokenKey = 'token',
  onAuthExpired?: () => void,
) => [
  (response: any) => {
    const { status, config, data } = response;
    handleAuthFailure(
      loginUrl,
      tokenKey,
      status,
      typeof config?.url === 'string' ? config.url : '',
      data?.errorMsg,
      onAuthExpired,
    );
    return response;
  },
  (error: any) => {
    handleAuthFailure(
      loginUrl,
      tokenKey,
      error?.response?.status,
      typeof error?.config?.url === 'string' ? error.config.url : '',
      error?.response?.data?.errorMsg,
      onAuthExpired,
    );
    throw error;
  },
];
