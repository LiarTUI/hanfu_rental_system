// 两端共用的请求拦截器：token 注入 + 登录态失效自动登出

/** token 注入：所有请求自动带上 Authorization 头 */
export const tokenRequestInterceptor = (url: string, options: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return { url, options };
};

/** 判断并执行失效登出：清 token 后跳转登录页 */
const handleAuthFailure = (
  loginUrl: string,
  status?: number,
  url?: string,
  errorMsg?: string,
) => {
  // 鉴权类失败才登出：401、token 对应用户已不存在、token 失效
  const tokenInvalid =
    status === 401 ||
    (errorMsg ?? '').includes('用户不存在') ||
    (errorMsg ?? '').includes('token失效');
  // 登录接口的"用户不存在"是账号输错，不当作登录态失效
  const isLoginApi = (url ?? '').includes('/login');
  if (tokenInvalid && !isLoginApi && localStorage.getItem('token')) {
    localStorage.removeItem('token');
    window.location.href = loginUrl;
  }
};

/**
 * 失效登出响应拦截器工厂，loginUrl 为登录页地址。
 * 返回 [成功分支, 失败分支]：成功分支处理 200 + errorMsg 的业务级失效，
 * 失败分支处理 HTTP 401 —— axios 对 4xx 走 rejection 路径，
 * 只注册成功分支的话 401 永远拦不到（umi 源码里数组形式才会挂上第二个参数）。
 */
export const createAuthResponseInterceptors = (loginUrl: string) => [
  (response: any) => {
    const { status, config, data } = response;
    handleAuthFailure(
      loginUrl,
      status,
      typeof config?.url === 'string' ? config.url : '',
      data?.errorMsg,
    );
    return response;
  },
  (error: any) => {
    handleAuthFailure(
      loginUrl,
      error?.response?.status,
      typeof error?.config?.url === 'string' ? error.config.url : '',
      error?.response?.data?.errorMsg,
    );
    throw error;
  },
];
