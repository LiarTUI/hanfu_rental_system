// Dashboard 第二屏面板:分布横条 / 待办与预警 / 热租 Top5
// 待办和 Top5 数据各组件自治拉取;接口未上线或失败时整卡空态,不显示假数据
import {
  getHotProducts,
  getTodos,
  type HotProduct,
  type NamedCount,
  type TodosData,
} from '@/services/stats';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './panels.less';

// 分布默认色板(超出 7 类的并入"其他",最多 8 行)
const PALETTE = [
  '#3066b6',
  '#52c41a',
  '#722ed1',
  '#fa8c16',
  '#13c2c2',
  '#faad14',
  '#eb2f96',
  '#8c8c8c',
];

// 成色 → 图表 hex 色(SKU 台账 Tag 色系对应:全新绿/良好蓝/微瑕金/报废红)
export const CONDITION_HEX: Record<number, string> = {
  1: '#52c41a',
  2: '#1677ff',
  3: '#faad14',
  4: '#ff4d4f',
};

/** 横向分布条(类目/朝代/成色共用):条宽按最大项铺满,右侧显示数量与占比 */
export function DistributionBar({
  items,
  unit,
  colorMap,
}: {
  items: NamedCount[];
  unit: string;
  colorMap?: Record<string, string>;
}) {
  // 前 7 类外的长尾并入"其他",避免撑爆卡片
  const top = items.slice(0, 7);
  const rest = items.slice(7).reduce((sum, it) => sum + it.count, 0);
  const rows = rest > 0 ? [...top, { name: '其他', count: rest }] : top;
  const max = Math.max(1, ...rows.map((r) => r.count));
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  if (!rows.length) return <div className={styles.emptyTip}>暂无数据</div>;
  return (
    <div>
      {rows.map((row, i) => {
        const color = colorMap?.[row.name] ?? PALETTE[i % PALETTE.length];
        const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
        return (
          <div className={styles.distBar} key={row.name + i}>
            <span className={styles.distName}>{row.name}</span>
            <span className={styles.distTrack}>
              <i
                className={styles.distFill}
                style={{
                  width: `${(row.count / max) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </span>
            <span className={styles.distNum}>
              <b>{row.count}</b> {unit} · {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 待办与预警:计数 + 点击直达对应处理页(0 计数行置灰仍可跳转) */
export function TodoPanel() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<TodosData>();

  useEffect(() => {
    (async () => {
      try {
        const res = await getTodos();
        setTodos(res?.data);
      } catch {
        /* 保持空态 */
      }
    })();
  }, []);

  const rows = [
    {
      key: 'pendingShipCount',
      label: '待发货订单',
      color: '#fa8c16',
      path: '/order/ship',
    },
    {
      key: 'overdueReturnCount',
      label: '逾期归还',
      color: '#ff4d4f',
      path: '/order/ship',
    },
    {
      key: 'damagingCount',
      label: '结算定损中',
      color: '#faad14',
      path: '/order/list',
    },
    {
      key: 'defectiveSkuCount',
      label: '微瑕/报废 SKU',
      color: '#722ed1',
      path: '/product/sku',
    },
    {
      key: 'lowCreditUserCount',
      label: '低信用会员',
      color: '#8c8c8c',
      path: '/member/list',
    },
  ] as const;

  if (!todos) return <div className={styles.emptyTip}>暂无数据</div>;
  return (
    <div>
      {rows.map((r) => {
        const count = todos[r.key] ?? 0;
        return (
          <div
            key={r.key}
            className={`${styles.todoRow} ${count === 0 ? styles.zero : ''}`}
            onClick={() => navigate(r.path)}
          >
            <i className={styles.dot} style={{ backgroundColor: r.color }} />
            <span className={styles.todoLabel}>{r.label}</span>
            <span className={styles.todoCount}>{count}</span>
            <RightOutlined className={styles.todoArrow} />
          </div>
        );
      })}
    </div>
  );
}

/** 热租汉服 Top5:近 30 天出租次数排行 */
export function HotProductsPanel() {
  const [list, setList] = useState<HotProduct[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHotProducts();
        setList(res?.data ?? []);
      } catch {
        /* 保持空态 */
      }
    })();
  }, []);

  if (!list.length) return <div className={styles.emptyTip}>暂无数据</div>;
  return (
    <div>
      {list.map((p, i) => (
        <div className={styles.hotRow} key={p.productId}>
          <span className={`${styles.rank} ${i < 3 ? styles['r' + i] : ''}`}>
            {i + 1}
          </span>
          <div className={styles.hotInfo}>
            <div className={styles.hotName}>{p.name}</div>
            <div className={styles.hotSub}>
              {[p.dynasty, p.category, p.storeName].filter(Boolean).join(' · ')}
            </div>
          </div>
          <span className={styles.rentCount}>
            {p.rentCount}
            <i>次</i>
          </span>
        </div>
      ))}
    </div>
  );
}
