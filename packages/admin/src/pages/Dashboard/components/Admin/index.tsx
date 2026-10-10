import CountUp from '@/components/CountUp';
import { getAllOrders } from '@/services/orders';
import { getStores } from '@/services/store';
import { getAllUsers } from '@/services/users';
import { Col, Row } from 'antd';
import type { EChartsOption } from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { IconFont } from 'shared';
import type { ComponentProps } from '../type';
import styles from './index.less';
export default function Admin(props: ComponentProps) {
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}`;
  const todayOrders = orders.filter(
    (o: any) => o?.createTime?.startsWith(todayStr) && o.isDeleted !== 1,
  );
  const todayUsers = users.filter((u: any) =>
    u?.createTime?.startsWith(todayStr),
  );

  const headerCards = [
    // store.status: 1=正常营业, 0=店铺离线
    {
      icon: 'icon-xiangzuojiantou',
      label: '营业中商店',
      count: stores.filter((s: any) => s.status === 1).length,
    },
    {
      icon: 'icon-xiangzuojiantou',
      label: '已注册用户数',
      count: users.length,
    },
    {
      icon: 'icon-xiangzuojiantou',
      label: '今日订单数',
      count: todayOrders.length,
    },
    {
      icon: 'icon-xiangzuojiantou',
      label: '今日新增用户',
      count: todayUsers.length,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await getStores();
        // 后端返回是裸数组还是 res.data,确认后保留一支删另一支
        setStores(res?.data ?? []);
      } catch {
        /* 接口失败时保持 0,不显示误导性假数据 */
      }
    })();
    (async () => {
      try {
        const res = await getAllUsers();
        setUsers(res?.data ?? []);
      } catch (e) {
        console.log(e);
      }
    })();
    (async () => {
      try {
        const res = await getAllOrders();
        setOrders(res?.data ?? []);
      } catch {}
    })();
  }, []);
  const option: EChartsOption = {
    xAxis: { type: 'category', data: ['周一', '周二'] },
    yAxis: {},
    series: [{ type: 'bar', data: [120, 200] }],
  };
  return (
    <div>
      <Row align={'middle'} gutter={[20, 20]} wrap={true}>
        {headerCards.map((item, index) => {
          return (
            <Col xs={24} sm={12} xl={6} className={styles.col}>
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
      <Row>
        <Col xl={12}>
          <ReactEcharts
            option={option}
            style={{ height: '400px' }}
            autoResize
          />
        </Col>
      </Row>
    </div>
  );
}
