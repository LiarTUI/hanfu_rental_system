import {
  Button,
  ConfigProvider,
  Dropdown,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import styles from './index.less';
import type { CustomTableProps, TableActionItem } from './type';
/** 平铺按钮上限，超出部分折叠进"更多"下拉 */
const MAX_INLINE = 3;

/** 单个操作按钮：有 confirm 则按钮本身不触发，由 Popconfirm 确认后执行，避免双触发 */
function ActionButton<T extends object>({
  item,
  record,
}: {
  item: TableActionItem<T>;
  record: T;
}) {
  const handle = () => item.onClick?.(record);
  const btn = (
    <Button
      type="link"
      size="small"
      danger={item.danger}
      loading={item.loading?.(record) ?? false}
      onClick={item.confirm ? undefined : handle}
    >
      {item.label}
    </Button>
  );
  return item.confirm ? (
    <Popconfirm title={item.confirm} onConfirm={handle}>
      {btn}
    </Popconfirm>
  ) : (
    btn
  );
}

/** 渲染一行的操作区：hidden 过滤 → 不超上限平铺，超出折叠进"更多" */
function renderActions<T extends object>(
  items: TableActionItem<T>[],
  record: T,
) {
  const visible = items.filter((it) => !it.hidden?.(record));
  if (visible.length === 0) return null;
  if (visible.length <= MAX_INLINE) {
    return (
      <Space size={0}>
        {visible.map((it) => (
          <ActionButton key={it.key} item={it} record={record} />
        ))}
      </Space>
    );
  }
  const inline = visible.slice(0, MAX_INLINE - 1);
  const more = visible.slice(MAX_INLINE - 1);
  return (
    <Space size={0}>
      {inline.map((it) => (
        <ActionButton key={it.key} item={it} record={record} />
      ))}
      <Dropdown
        menu={{
          items: more.map((it) => ({
            key: it.key,
            label: it.label,
            danger: it.danger,
            disabled: it.loading?.(record),
          })),
          onClick: ({ key }) => {
            const target = more.find((it) => it.key === key);
            if (!target) return;
            // 菜单项没法包 Popconfirm，confirm 的用 Modal 兜底确认
            if (target.confirm) {
              Modal.confirm({
                title: target.confirm,
                okButtonProps: { danger: target.danger },
                onOk: () => target.onClick?.(record),
              });
            } else {
              target.onClick?.(record);
            }
          },
        }}
      >
        <Button type="link" size="small">
          更多
        </Button>
      </Dropdown>
    </Space>
  );
}

/**
 * 薄封装的 antd Table：
 * - 泛型 <T> 让列定义与行数据共用同一类型
 * - data 即 dataSource 的别名，其余 Table props 原样透传
 * - actions 传入则自动追加为最后一列（固定右侧、超量折叠、危险确认）
 * - ConfigProvider 统一两端表格主题（配色/圆角等）
 */
export default function CustomTable<T extends object>({
  data,
  actions,
  columns,
  shadow,
  ...rest
}: CustomTableProps<T>) {
  const finalColumns = [...(columns ?? [])];
  if (actions?.length) {
    finalColumns.push({
      title: '操作',
      key: '__actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => renderActions(actions, record),
    });
  }
  const ComputedStyles = `${shadow ? styles.boxShadow : ''}`;
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            // 表头：浅灰底 + 深灰字，克制不抢戏
            headerBg: '#fafbfc',
            headerColor: '#1d2129',
            headerSplitColor: 'transparent',
            // 表头圆角
            headerBorderRadius: 12,
            // 行悬浮：柔和的灰色高亮
            rowHoverBg: '#9ab8e6',
            // 单元格内边距，行高更透气
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
          },
          Pagination: {
            itemBg: '#ffffff', // 页码默认底色
            itemActiveBg: '#3066b6', // 当前页底色
            itemActiveColor: '#ffffff', // 当前页文字色
            itemActiveColorHover: '#ffffff', // 当前页 hover 文字色
          },
        },
      }}
    >
      <Table<T>
        className={ComputedStyles}
        {...rest}
        columns={finalColumns}
        dataSource={data}
      />
    </ConfigProvider>
  );
}

export type { CustomTableProps, TableActionItem } from './type';
