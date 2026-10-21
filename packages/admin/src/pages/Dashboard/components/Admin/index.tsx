import CountUp from '@/components/CountUp';
import { ORDER_STATUS } from '@/pages/order/list/type';
import { CONDITION_STATUS } from '@/pages/product/sku/type';
import {
  getDistribution,
  getProductDist,
  getSkuCondition,
  getStats,
  getTrend,
  type DistributionData,
  type ProductDistData,
  type SkuConditionData,
  type StatsData,
  type TrendPoint,
} from '@/services/stats';
import {
  AccountBookOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Col, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { EChartsOption } from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from '../type';
import styles from './index.less';
import {
  CONDITION_HEX,
  DistributionBar,
  HotProductsPanel,
  TodoPanel,
} from './panels';

dayjs.locale('zh-cn');

type Tone = 'up' | 'down' | 'flat' | 'warn' | 'none';

// 环比副标:对比字段后端未上线(undefined)降级显示 —
function diffTrend(
  today?: number,
  yesterday?: number,
): { text: string; tone: Tone } {
  if (today == null || yesterday == null) return { text: '—', tone: 'none' };
  if (today === yesterday) return { text: '与昨日持平', tone: 'flat' };
  if (yesterday === 0) return { text: `较昨日 +${today}`, tone: 'up' };
  const pct = Math.round((Math.abs(today - yesterday) / yesterday) * 100);
  return today > yesterday
    ? { text: `较昨日 +${pct}%`, tone: 'up' }
    : { text: `较昨日 -${pct}%`, tone: 'down' };
}

// 订单状态 → 图表用十六进制色(与订单列表 Tag 色系一致)
const STATUS_HEX: Record<number, string> = {
  0: '#8c8c8c',
  1: '#fa8c16',
  2: '#1677ff',
  3: '#722ed1',
  4: '#faad14',
  5: '#52c41a',
  6: '#ff4d4f',
};

// 图表空态文案:接口失败/无数据时居中显示,不画假数据
const EMPTY = {
  text: '暂无数据',
  left: 'center',
  top: 'middle',
  textStyle: { color: 'rgba(0, 0, 0, 0.25)', fontSize: 14, fontWeight: 400 },
};

export default function Admin(props: ComponentProps) {
  const { initialState } = useModel('@@initialState');
  // 统计数字由后端聚合接口一次返回,不再拉三个全量列表前端自己数
  const [stats, setStats] = useState<StatsData>({});
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [dist, setDist] = useState<DistributionData>();
  const [productDist, setProductDist] = useState<ProductDistData>();
  const [skuCond, setSkuCond] = useState<SkuConditionData>();
  // "x 分钟前更新"相对时间,每 30s 重算一次
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    (async () => {
      try {
        const res = await getStats();
        setStats(res?.data ?? {});
      } catch {
        /* 接口失败时保持 0,不显示误导性假数据 */
      }
    })();
    (async () => {
      try {
        const res = await getTrend();
        setTrend(res?.data ?? []);
      } catch {
        /* 图表保持空态 */
      }
    })();
    (async () => {
      try {
        const res = await getDistribution();
        setDist(res?.data);
      } catch {
        /* 图表保持空态 */
      }
    })();
    (async () => {
      try {
        const res = await getProductDist();
        setProductDist(res?.data);
      } catch {
        /* 分布保持空态 */
      }
    })();
    (async () => {
      try {
        const res = await getSkuCondition();
        setSkuCond(res?.data);
      } catch {
        /* 分布保持空态 */
      }
    })();
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const hour = dayjs().hour();
  const greet =
    hour < 6
      ? '夜深了'
      : hour < 12
      ? '早上好'
      : hour < 18
      ? '下午好'
      : '晚上好';
  const dateText = dayjs().format('YYYY年M月D日 dddd');

  const updatedText = useMemo(() => {
    if (!stats.updatedAt) return '';
    const t = dayjs(stats.updatedAt, 'YYYY-MM-DD HH:mm:ss').valueOf();
    const mins = Math.round((now - t) / 60000);
    if (mins < 1) return '刚刚更新';
    if (mins < 60) return `${mins} 分钟前更新`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `${h} 小时前更新`;
    return `${Math.floor(h / 24)} 天前更新`;
  }, [now, stats.updatedAt]);

  const cards = [
    {
      label: '营业中商店',
      icon: <ShopOutlined />,
      color: '#1677ff',
      value: stats.openStoreCount ?? 0,
      money: false,
      trend:
        stats.weekNewStoreCount == null
          ? { text: '—', tone: 'none' as Tone }
          : stats.weekNewStoreCount > 0
          ? { text: `本周 +${stats.weekNewStoreCount}`, tone: 'up' as Tone }
          : { text: '本周暂无新开', tone: 'flat' as Tone },
    },
    {
      label: '注册会员',
      icon: <TeamOutlined />,
      color: '#52c41a',
      value: stats.userCount ?? 0,
      money: false,
      trend: {
        text:
          stats.todayNewUsers == null ? '—' : `今日 +${stats.todayNewUsers}`,
        tone: 'up' as Tone,
      },
    },
    {
      label: '今日订单',
      icon: <ShoppingOutlined />,
      color: '#722ed1',
      value: stats.todayOrderCount ?? 0,
      money: false,
      trend: diffTrend(stats.todayOrderCount, stats.yesterdayOrderCount),
    },
    {
      label: '今日新增用户',
      icon: <UserAddOutlined />,
      color: '#fa8c16',
      value: stats.todayNewUsers ?? 0,
      money: false,
      trend: diffTrend(stats.todayNewUsers, stats.yesterdayNewUsers),
    },
    {
      label: '今日 GMV',
      icon: <AccountBookOutlined />,
      color: '#13c2c2',
      value: stats.todayTotalAmount ?? 0,
      money: true,
      trend: diffTrend(stats.todayTotalAmount, stats.yesterdayTotalAmount),
    },
    {
      label: '逾期归还',
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      value: stats.overdueReturnCount ?? 0,
      money: false,
      trend: { text: '需尽快跟进', tone: 'warn' as Tone },
    },
  ];

  // 图表 1:近 30 天 GMV(柱,左轴) + 订单量(折线,右轴)
  const trendOption = useMemo<EChartsOption>(() => {
    const option: EChartsOption = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['GMV(元)', '订单量(单)'], top: 0, right: 0 },
      grid: { left: 16, right: 16, top: 36, bottom: 8, containLabel: true },
      xAxis: {
        type: 'category',
        data: trend.map((t) => dayjs(t.date).format('MM-DD')),
      },
      yAxis: [
        { type: 'value', axisLabel: { formatter: '¥{value}' } },
        { type: 'value', minInterval: 1 },
      ],
      series: [
        {
          name: 'GMV(元)',
          type: 'bar',
          data: trend.map((t) => t.totalAmount),
          barMaxWidth: 18,
          itemStyle: { color: '#3066b6', borderRadius: [3, 3, 0, 0] },
        },
        {
          name: '订单量(单)',
          type: 'line',
          yAxisIndex: 1,
          data: trend.map((t) => t.orderCount),
          smooth: true,
          symbolSize: 5,
          itemStyle: { color: '#fa8c16' },
        },
      ],
    };
    if (!trend.length) option.title = [EMPTY];
    return option;
  }, [trend]);

  // 图表 2:订单状态环形分布,7 态补齐(后端漏的补 0),count=0 不入图
  const distOption = useMemo<EChartsOption>(() => {
    const items = dist?.items ?? [];
    const filled = Array.from({ length: 7 }, (_, s) => ({
      status: s,
      count: items.find((i) => i.status === s)?.count ?? 0,
    })).filter((i) => i.count > 0);
    const data = filled.map((i) => ({
      value: i.count,
      name: ORDER_STATUS[i.status]?.text ?? `状态${i.status}`,
      itemStyle: { color: STATUS_HEX[i.status] },
    }));
    const option: EChartsOption = {
      tooltip: { trigger: 'item', formatter: '{b}: {c} 单 ({d}%)' },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'middle',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
      },
      series: [
        {
          type: 'pie',
          radius: ['52%', '78%'],
          center: ['34%', '52%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          labelLine: { show: false },
          data,
        },
      ],
    };
    if (data.length) {
      // 环心显示总单数:title 组件自带 textAlign 定位,textAlign center 使整体在 left 处水平居中
      option.title = {
        text: String(dist?.totalCount ?? 0),
        subtext: '全部订单',
        left: '34%',
        top: '42%',
        textAlign: 'center',
        textStyle: {
          fontSize: 22,
          fontWeight: 700,
          color: 'rgba(0, 0, 0, 0.85)',
        },
        subtextStyle: { fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' },
      };
    } else {
      option.title = [EMPTY];
    }
    return option;
  }, [dist]);

  // 后面待办/排行模块上线后补在第二行

  // 成色分布:conditionStatus → 文案 + 文案色映射(与 SKU 台账色系一致)
  const condItems = useMemo(
    () =>
      (skuCond?.items ?? []).map((it) => ({
        name:
          CONDITION_STATUS[it.conditionStatus]?.text ??
          `状态${it.conditionStatus}`,
        count: it.count,
      })),
    [skuCond],
  );
  const condColorMap = useMemo(() => {
    const m: Record<string, string> = {};
    (skuCond?.items ?? []).forEach((it) => {
      const name =
        CONDITION_STATUS[it.conditionStatus]?.text ??
        `状态${it.conditionStatus}`;
      m[name] = CONDITION_HEX[it.conditionStatus] ?? '#8c8c8c';
    });
    return m;
  }, [skuCond]);

  return (
    <div>
      {/* 标题区:问候 + 日期 + 数据更新时间 */}
      <div className={styles.dashHeader}>
        <div>
          <h2 className={styles.greet}>
            {greet}，{initialState?.name || '管理员'}
          </h2>
          <p className={styles.dateLine}>{dateText} · 平台运营概览</p>
        </div>
        <span className={styles.updated}>{updatedText || '—'}</span>
      </div>

      <Divider style={{ opacity: 0 }} />
      <Row gutter={[16, 16]} wrap>
        {cards.map((item) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={item.label}>
            <div className={styles.headerCard}>
              <i
                className={styles.colorBar}
                style={{ backgroundColor: item.color }}
              />
              <div className={styles.cardBody}>
                <span
                  className={styles.iconBlock}
                  style={{ color: item.color }}
                >
                  {item.icon}
                </span>
                <div className={styles.cardInfo}>
                  <span className={styles.cardLabel}>{item.label}</span>
                  <div className={styles.cardValue}>
                    {item.money && <i>¥</i>}
                    <CountUp value={item.value} />
                  </div>
                  <span
                    className={`${styles.trend} ${
                      styles['t_' + item.trend.tone]
                    }`}
                  >
                    {item.trend.text}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Divider style={{ opacity: 0 }} />
      <Row gutter={[16, 16]} className={styles.chartRow}>
        {/* 趋势大图 + 状态环形小图同一行,窄屏堆叠 */}
        <Col xs={24} xl={16}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>近 30 天订单与营收趋势</h4>
            <ReactEcharts
              option={trendOption}
              autoResize
              style={{ height: 280 }}
            />
          </div>
        </Col>
        <Col xs={24} xl={8}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>订单状态分布 · 全部订单</h4>
            <ReactEcharts
              option={distOption}
              autoResize
              style={{ height: 280 }}
            />
          </div>
        </Col>
      </Row>

      <Divider style={{ opacity: 0 }} />
      <Row gutter={[16, 16]} className={styles.chartRow}>
        {/* 三条分布:类目/朝代(在售 SPU) + 成色(库存实物) */}
        <Col xs={24} lg={8}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>汉服类目分布</h4>
            <div className={styles.cardSub}>
              在售商品 {productDist?.totalCount ?? 0} 款
            </div>
            <DistributionBar
              items={productDist?.categoryItems ?? []}
              unit="款"
            />
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>朝代形制分布</h4>
            <div className={styles.cardSub}>
              在售商品 {productDist?.totalCount ?? 0} 款
            </div>
            <DistributionBar
              items={productDist?.dynastyItems ?? []}
              unit="款"
            />
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>SKU 成色分布</h4>
            <div className={styles.cardSub}>
              库存实物 {skuCond?.totalSku ?? 0} 件
            </div>
            <DistributionBar
              items={condItems}
              unit="件"
              colorMap={condColorMap}
            />
          </div>
        </Col>
      </Row>

      <Divider style={{ opacity: 0 }} />
      <Row gutter={[16, 16]} className={styles.chartRow}>
        <Col xs={24} lg={8}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>待办与预警</h4>
            <TodoPanel />
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div className={styles.chartCard}>
            <h4 className={styles.chartTitle}>热租汉服 Top5 · 近 30 天</h4>
            <HotProductsPanel />
          </div>
        </Col>
      </Row>
    </div>
  );
}
