// 权限定义：根据后端 /api/admin/menus 返回的路径列表，决定各菜单分组是否可见/可访问
// 路由里通过 access: 'menuXxx' 引用这里的 key
interface AdminInitialState {
  menuPaths?: string[];
}

export default (initialState: AdminInitialState) => {
  // 命中规则：后端返回的路径等于该前缀，或在该前缀之下（/system/user 命中 /system）
  const has = (prefix: string) =>
    initialState.menuPaths?.some(
      (p) => p === prefix || p.startsWith(`${prefix}/`),
    ) ?? false;

  return {
    menuDashboard: has('/dashboard'),
    menuSystem: has('/system'),
    menuStore: has('/store'),
    menuProduct: has('/product'),
    menuOrder: has('/order'),
  };
};
