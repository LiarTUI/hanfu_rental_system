import { getStores } from '@/services/store';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { IconFont } from 'shared';
import type { ComponentProps } from '../type';
import styles from './index.less';
const headerCards = [
  { icon: 'icon-xiangzuojiantou', label: '入驻商店数', count: 100 },
  { icon: 'icon-xiangzuojiantou', label: '入驻商店数', count: 100 },
  { icon: 'icon-xiangzuojiantou', label: '入驻商店数', count: 100 },
  { icon: 'icon-xiangzuojiantou', label: '入驻商店数', count: 100 },
];
export default function Admin(props: ComponentProps) {
  const [stores, setStores] = useState([]);
  // const [headerCards,setHeaderCards] = useState([])
  useEffect(() => {
    getStoreCount();
  }, []);
  const getStoreCount = async () => {
    const res = await getStores();
    setStores(res);
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
                  <span>{item.count}</span>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
