import {
  cancelOrder,
  getMyOrders,
  payOrder,
  returnOrder,
  type MyOrderData,
} from '@/services/order';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import {
  Button,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Tag,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { ORDER_STATUS, useAuth } from 'shared';
import styles from './index.less';

export default function MyOrders() {
  const navigate = useNavigate();
  const { isLogin, openLogin } = useAuth();

  const [orders, setOrders] = useState<MyOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null); // 当前执行操作（支付/取消/归还）的订单

  const fetchOrders = () => {
    setLoading(true);
    getMyOrders()
      .then((res) => setOrders(res?.data ?? []))
      .catch(() => message.error('订单加载失败，请稍后再试'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isLogin) fetchOrders();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  // 模拟支付：真实支付（支付宝）后续仅替换 payOrder 内部实现
  const handlePay = (o: MyOrderData) => {
    Modal.confirm({
      title: '确认支付',
      content: `订单 ${o.orderNo} 应付 ¥${o.totalAmount}（模拟支付，不产生真实扣款）`,
      okText: '确认支付',
      onOk: async () => {
        const res = await payOrder(o.id);
        if (res?.success) {
          message.success('支付成功，等待商家发货');
          fetchOrders();
        } else {
          message.error(res?.errorMsg || '支付失败');
        }
      },
    });
  };

  const handleCancel = async (o: MyOrderData) => {
    setActingId(o.id);
    try {
      const res = await cancelOrder(o.id);
      if (res?.success) {
        message.success('订单已取消');
        fetchOrders();
      } else {
        message.error(res?.errorMsg || '取消失败');
      }
    } finally {
      setActingId(null);
    }
  };

  // 归还：填归还快递单号 → 结算定损中
  const handleReturn = (o: MyOrderData) => {
    let trackingNo = '';
    Modal.confirm({
      title: '发起归还',
      content: (
        <div>
          <p style={{ marginBottom: 8 }}>请先寄出衣衫，再填写归还快递单号：</p>
          <Input
            placeholder="如 SF1234567890"
            onChange={(e) => {
              trackingNo = e.target.value.trim();
            }}
          />
        </div>
      ),
      okText: '提交归还',
      onOk: async () => {
        if (!trackingNo) {
          message.warning('请填写归还快递单号');
          return Promise.reject();
        }
        const res = await returnOrder(o.id, trackingNo);
        if (res?.success) {
          message.success('归还登记成功，等待平台验收结算');
          fetchOrders();
        } else {
          message.error(res?.errorMsg || '归还登记失败');
        }
      },
    });
  };

  // 各状态下可用的操作（0 待支付 → 支付/取消；2 租赁中、3 待归还 → 归还）
  const renderActions = (o: MyOrderData) => {
    if (o.status === 0) {
      return (
        <div className={styles.actions}>
          <Button type="primary" size="small" onClick={() => handlePay(o)}>
            立即支付
          </Button>
          <Popconfirm
            title="取消后押金预授权将释放，确定取消？"
            onConfirm={() => handleCancel(o)}
          >
            <Button size="small" danger loading={actingId === o.id}>
              取消订单
            </Button>
          </Popconfirm>
        </div>
      );
    }
    if (o.status === 2 || o.status === 3) {
      return (
        <div className={styles.actions}>
          <Button size="small" onClick={() => handleReturn(o)}>
            归还衣衫
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.orders}>
      <div className={styles.wrap}>
        <div className={styles.backLink} onClick={() => navigate('/home')}>
          <LeftOutlined /> 返回首页
        </div>

        <h1 className={styles.pageTitle}>我的订单</h1>
        <p className={styles.pageSub}>衣裳所历，皆有序可循</p>

        {!isLogin ? (
          <div className={styles.empty}>
            <Empty description="登录后查看您的租赁订单" />
            <Button
              type="primary"
              onClick={() => openLogin({ after: fetchOrders })}
            >
              去登录
            </Button>
          </div>
        ) : loading ? (
          <div className={styles.empty}>
            <Spin />
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>
            <Empty description="还没有租赁订单" />
            <Button onClick={() => navigate('/home')}>去市集逛逛</Button>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((o) => {
              const s = ORDER_STATUS[o.status];
              return (
                <div key={o.id} className={styles.card}>
                  <div className={styles.cover}>
                    {o.productCover ? (
                      <img src={o.productCover} alt={o.productName ?? ''} />
                    ) : (
                      <span className={styles.coverPlaceholder}>衣</span>
                    )}
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>
                      {o.productName || '华衿衣衫'}
                      {o.size && <em className={styles.size}>{o.size} 码</em>}
                    </p>
                    <p className={styles.meta}>订单号 {o.orderNo}</p>
                    <p className={styles.meta}>
                      档期 {o.rentStartDate} ~ {o.rentEndDate}
                    </p>
                    {(o.status === 1 || o.status === 2) && o.trackingNoSend && (
                      <p className={styles.meta}>寄出 {o.trackingNoSend}</p>
                    )}
                    {o.trackingNoReturn && (
                      <p className={styles.meta}>归还 {o.trackingNoReturn}</p>
                    )}
                  </div>
                  <div className={styles.side}>
                    <Tag color={s?.color}>{s?.text ?? `状态${o.status}`}</Tag>
                    <p className={styles.amount}>¥{o.totalAmount}</p>
                    <p className={styles.deposit}>
                      押金 ¥{o.depositAmount} 可退
                    </p>
                    {renderActions(o)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
