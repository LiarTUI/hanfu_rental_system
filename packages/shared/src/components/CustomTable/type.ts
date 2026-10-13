import type { TableProps } from 'antd';

/**
 * 操作列的单个操作：
 * 组件只负责渲染、折叠与二次确认，业务请求由页面在 onClick 里自行发起。
 */
export type TableActionItem<T> = {
  /** 唯一标识，作 React key 与折叠菜单 item key */
  key: string;
  /** 按钮文字 */
  label: string;
  /** 危险操作，红色按钮 */
  danger?: boolean;
  /** 有值则点击先确认（平铺用 Popconfirm，菜单内用 Modal），确认后才执行 onClick */
  confirm?: string;
  /** 返回 true 则该行不渲染此按钮 */
  hidden?: (record: T) => boolean;
  /** 该行此按钮的加载态（防重复提交） */
  loading?: (record: T) => boolean;
  onClick?: (record: T) => void;
};

/**
 * CustomTable 的 props：
 * 泛型 T 同时约束 columns 与 data，列里 record.xxx 写错字段名编译期可查。
 * （TableProps<T> 已含 columns、dataSource、分页、loading 等全部透传能力）
 */
export type CustomTableProps<T> = TableProps<T> & {
  /** 行数据，语义上等价于 Table 的 dataSource，名字上对业务侧更直白 */
  data?: T[];
  /** 传入则自动追加为最后一列：固定右侧、默认宽 120、超过 3 个折叠进"更多" */
  actions?: TableActionItem<T>[];
};
