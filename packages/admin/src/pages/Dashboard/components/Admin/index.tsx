import CountUp from '@/components/CountUp';
import { getStats, type StatsData } from '@/services/stats';
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

export default function Admin(props: ComponentProps) {
  const { initialState } = useModel('@@initialState');
  // 统计数字由后端聚合接口一次返回,不再拉三个全量列表前端自己数
  const [stats, setStats] = useState<StatsData>({});
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
      bg: 'rgba(22, 119, 255, 0.1)',
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
      bg: 'rgba(82, 196, 26, 0.1)',
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
      bg: 'rgba(114, 46, 209, 0.1)',
      value: stats.todayOrderCount ?? 0,
      money: false,
      trend: diffTrend(stats.todayOrderCount, stats.yesterdayOrderCount),
    },
    {
      label: '今日新增用户',
      icon: <UserAddOutlined />,
      color: '#fa8c16',
      bg: 'rgba(250, 140, 22, 0.1)',
      value: stats.todayNewUsers ?? 0,
      money: false,
      trend: diffTrend(stats.todayNewUsers, stats.yesterdayNewUsers),
    },
    {
      label: '今日 GMV',
      icon: <AccountBookOutlined />,
      color: '#13c2c2',
      bg: 'rgba(19, 194, 194, 0.1)',
      value: stats.todayTotalAmount ?? 0,
      money: true,
      trend: diffTrend(stats.todayTotalAmount, stats.yesterdayTotalAmount),
    },
    {
      label: '逾期归还',
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      bg: 'rgba(255, 77, 79, 0.1)',
      value: stats.overdueReturnCount ?? 0,
      money: false,
      trend: { text: '需尽快跟进', tone: 'warn' as Tone },
    },
  ];

  const option: EChartsOption = {
    xAxis: { type: 'category', data: ['周一', '周二'] },
    yAxis: {},
    series: [{ type: 'bar', data: [120, 200] }],
  };
  const option2: EChartsOption = {
    xAxis: { type: 'category', data: ['周一', '周二'] },
    yAxis: {},
    series: [{ type: 'bar', data: [120, 200] }],
  };

  return (
    <div>
      {/* 标题区:问候 + 日期 + 数据更新时间 */}
      <div className={styles.dashHeader}>
        <div className={styles.greetContanier}>
          <h2 className={styles.greet}>
            {greet}，{initialState?.name || '管理员'}
          </h2>
          <p className={styles.dateLine}>{dateText} · 平台运营概览</p>
        </div>
        <span className={styles.updated}>{updatedText || '—'}</span>
      </div>
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
                  style={{ color: item.color, backgroundColor: item.bg }}
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
      <Row gutter={[20, 20]} className={styles.chartRow}>
        <Col span={24}>
          <div className={styles.smallEcharts}>
            <ReactEcharts option={option} autoResize />
          </div>
        </Col>
      </Row>
      <Divider style={{ opacity: 0 }} />
      <Row gutter={[20, 20]} className={styles.chartRow}>
        <Col span={8}>
          <div className={styles.smallEcharts}>
            <ReactEcharts option={option2} autoResize />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.smallEcharts}>
            <ReactEcharts option={option2} autoResize />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.smallEcharts}>
            <ReactEcharts option={option2} autoResize />
          </div>
        </Col>
      </Row>
    </div>
  );
}
