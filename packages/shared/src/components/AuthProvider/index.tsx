import { message } from 'antd';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LoginModal } from '../Login';

/** 登录用户概要（来自登录/注册响应或 profile 接口） */
export type AuthUser = {
  userId?: number;
  username?: string;
  avatar?: string;
  [key: string]: any;
} | null;

/** 打开登录弹窗的参数：after 为登录成功后继续执行的动作（如下单、跳个人中心） */
export type OpenLoginOptions = {
  after?: () => void;
  tab?: 'login' | 'register';
};

type AuthContextValue = {
  /** 是否已登录（以本地 token 为准） */
  isLogin: boolean;
  /** 已登录时的用户概要（username/avatar），游客为 null */
  user: AuthUser;
  /** 打开登录 Modal，可携带登录后要继续的动作 */
  openLogin: (opts?: OpenLoginOptions) => void;
  /** 退出登录：清 token + 重置用户态（跳转由调用方决定） */
  logout: () => void;
  /** 重新拉取用户信息（改头像等操作后刷新顶栏） */
  refreshUser: () => Promise<void>;
};

// 默认值仅用于独立使用（未包 Provider）时不崩，正常都应包在 AuthProvider 里
const AuthContext = createContext<AuthContextValue>({
  isLogin: false,
  user: null,
  openLogin: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
  /** token 存储的 localStorage key（web 'token' / admin 'admin_token'） */
  tokenKey?: string;
  /** 拉取当前登录用户概要的接口（如 web 的 getProfile），返回整个响应对象 */
  fetchUser: () => Promise<any>;
  /** 登录失效（401）时请求层派发的全局事件名，默认 'auth:expired' */
  expiredEvent?: string;
}

/**
 * 全局登录态 Provider（web 游客模式核心）：
 * - rootContainer 包在 React 树根部，任意组件 useAuth() 拿登录态与弹窗入口
 * - 三条登录入口收敛于此：业务操作 openLogin({after})、401 失效事件、顶栏按钮
 * - 内部挂 LoginModal，登录成功后刷新用户信息并执行 pendingAction，不整页刷新
 */
export function AuthProvider({
  children,
  tokenKey = 'token',
  fetchUser,
  expiredEvent = 'auth:expired',
}: AuthProviderProps) {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(
    () => !!localStorage.getItem(tokenKey),
  );
  const [user, setUser] = useState<AuthUser>(null);
  // pendingAction 存 ref：弹窗打开期间不因重渲染丢失，执行一次即清
  const pendingRef = useRef<(() => void) | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetchUser();
      // profile 接口业务数据在 res.data（与列表接口同构）
      setUser(res?.data ?? null);
    } catch {
      // 拉不到用户信息不阻塞流程，顶栏退化为"已登录但无头像"
    }
  }, [fetchUser]);

  // 首次进入：已登录才拉用户信息，游客不请求（避免每次进站都白挨一个 401）
  useEffect(() => {
    if (isLogin) {
      refreshUser();
    }
    // 仅初始化时执行一次
  }, []);

  const openLogin = useCallback((opts?: OpenLoginOptions) => {
    pendingRef.current = opts?.after ?? null;
    // open 状态在弹窗已打开时保持，仅更新 pending
    setOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setOpen(false);
    pendingRef.current = null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    setIsLogin(false);
    setUser(null);
  }, [tokenKey]);

  // 登录/注册成功：关弹窗 → 用户概要直接上屏 → 执行登录前想做的动作 → 后台拉全量
  const handleSuccess = useCallback(
    (data?: any) => {
      setIsLogin(true);
      setOpen(false);
      // 后端 login/register 响应 data 自带 { userId, username, avatar }，
      // 先用它立即更新顶栏，避免等 profile 请求的空窗
      if (data) {
        setUser({
          userId: data.userId,
          username: data.username,
          avatar: data.avatar,
        });
      }
      const pending = pendingRef.current;
      pendingRef.current = null;
      refreshUser();
      pending?.();
    },
    [refreshUser],
  );

  // 请求层的 401 失效事件：清本地态并弹 Modal（token 已由请求层清除）
  useEffect(() => {
    const onExpired = () => {
      setIsLogin(false);
      setUser(null);
      setOpen((prev) => {
        // 弹窗已开则不重复提示（并发请求可能触发多个 401）
        if (!prev) {
          message.warning('登录已过期，请重新登录');
        }
        return true;
      });
    };
    window.addEventListener(expiredEvent, onExpired);
    return () => window.removeEventListener(expiredEvent, onExpired);
  }, [expiredEvent]);

  return (
    <AuthContext.Provider
      value={{ isLogin, user, openLogin, logout, refreshUser }}
    >
      {children}
      <LoginModal
        open={open}
        onClose={closeLogin}
        onSuccess={handleSuccess}
        tokenKey={tokenKey}
      />
    </AuthContext.Provider>
  );
}
