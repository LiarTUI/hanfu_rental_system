import type { TableProps } from 'antd';

/**
 * 操作列的单个操作：
 * 组件只负责渲染、折叠与二次确认，业务请求由页面在 onClick 里自行发起。
 */
export type TableActionItem<T> = {
  /** 唯一标识，作 React key 与折叠菜单 item key */
  key: string;
  /** 按钮文字 */
  label: string | ((record: T) => React.ReactNode);
  /** 危险操作，红色按钮；传函数则按行判断 */
  danger?: boolean | ((record: T) => boolean);
  /** 有值则点击先确认（平铺用 Popconfirm，菜单内用 Modal），确认后才执行 onClick；传函数则按行生成文案 */
  confirm?: string | ((record: T) => string);
  /** 返回 true 则该行不渲染此按钮 */
  hidden?: (record: T) => boolean;
  /** 该行此按钮的加载态（防重复提交） */
  loading?: (record: T) => boolean;
  onClick?: (record: T) => void;
};

/**
 * 平铺搜索区的单个字段配置：
 * 每个字段渲染一个独立的搜索框（placeholder = 搜索+label），
 * 多框之间为 AND 关系，各词只匹配自己负责的字段。
 */
export type SearchField<T> = {
  /** 参与匹配的行字段 */
  field: keyof T;
  /** 展示名，拼进 placeholder（如"搜索商品名称"） */
  label?: string;
  /** 完整自定义 placeholder，优先于 label */
  placeholder?: string;
  /** 搜索框宽度，默认 240 */
  width?: number;
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
  /** 传入则表格加投影阴影（index.less 的 .boxShadow） */
  shadow?: boolean;
  /** 传入则表格上方平铺渲染搜索框并做客户端过滤；不传则不渲染搜索区 */
  searchFields?: SearchField<T>[];
  /** 搜索区同行右侧的工具区（如"新建"按钮）；无搜索区时单独渲染在表格上方 */
  toolbar?: React.ReactNode;
};
