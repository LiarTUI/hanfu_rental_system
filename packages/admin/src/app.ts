// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'Admin' };
}
