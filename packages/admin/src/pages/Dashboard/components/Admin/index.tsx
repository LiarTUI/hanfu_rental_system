import CountUp from '@/components/CountUp';
import { getStats, type StatsData } from '@/services/stats';
import { Col, Divider, Row } from 'antd';
import type { EChartsOption } from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { IconFont } from 'shared';
import type { ComponentProps } from '../type';
import styles from './index.less';
export default function Admin(props: ComponentProps) {
  // 统计数字由后端聚合接口一次返回,不再拉三个全量列表前端自己数
  const [stats, setStats] = useState<StatsData>({});

  const headerCards = [
    {
      icon: 'icon-xiangzuojiantou',
      label: '营业中商店',
      count: stats.openStoreCount ?? 0,
    },
    {
      icon: 'icon-xiangzuojiantou',
      label: '已注册用户数',
      count: stats.userCount ?? 0,
    },
    {
      icon: 'icon-xiangzuojiantou',
      label: '今日订单数',
      count: stats.todayOrderCount ?? 0,
    },
    {
      icon: 'icon-xiangzuojiantou',
      label: '今日新增用户',
      count: stats.todayNewUsers ?? 0,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await getStats();
        setStats(res?.data ?? {});
      } catch {
        /* 接口失败时保持 0,不显示误导性假数据 */
      }
    })();
  }, []);
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
      <Row align={'middle'} gutter={[20, 20]} wrap={true}>
        {headerCards.map((item, index) => {
          return (
            <Col xs={24} sm={12} xl={6} className={styles.col} key={item.label}>
              <div className={styles.headerCard}>
                {/* todo 去找icon*/}
                <IconFont type={item.icon} size={24} className={styles.icon} />
                <div className={styles.info}>
                  <span>{item.label}</span>
                  <span>
                    <CountUp value={item.count} />
                  </span>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
      <Divider style={{ opacity: 0 }}></Divider>
      <Row gutter={[20, 20]} className={styles.chartRow}>
        <Col span={24}>
          <div className={styles.smallEcharts}>
            <ReactEcharts option={option} autoResize />
          </div>
        </Col>
      </Row>
      <Divider style={{ opacity: 0 }}></Divider>
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
