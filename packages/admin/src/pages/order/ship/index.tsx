import { getAllOrders } from '@/services/orders';
import type { TableColumnsType } from 'antd';
import { Descriptions, Input, message, Modal, Select, Tabs, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { CustomTable } from 'shared';
import { ORDER_STATUS, type OrderData } from '../list/type';
import styles from './index.less';

/** 快递公司选项（后端如有维护快递字典可换接口拉取） */
const EXPRESS_OPTIONS = [
  '顺丰速运',
  '京东物流',
  '中通快递',
  '圆通速递',
  '韵达快递',
  '邮政EMS',
].map((name) => ({ value: name, label: name }));

/** 顶部统计卡：颜色对齐订单状态 Tag 色系；key 对应可跳转的 Tab */
const STATUS_CARDS: {
  key: 'ship' | 'rent' | 'return' | 'settle';
  status: 1 | 2 | 3 | 4;
  label: string;
  gradient: string;
}[] = [
  {
    key: 'ship',
    status: 1,
    label: '待发货',
    gradient: 'linear-gradient(135deg, #ffb347, #ff7043)',
  },
  {
    key: 'rent',
    status: 2,
    label: '租赁中',
    gradient: 'linear-gradient(135deg, #64a4ff, #2f54eb)',
  },
  {
    key: 'return',
    status: 3,
    label: '待归还',
    gradient: 'linear-gradient(135deg, #b28df3, #722ed1)',
  },
  {
    key: 'settle',
    status: 4,
    label: '结算定损中',
    gradient: 'linear-gradient(135deg, #ffd666, #faad14)',
  },
];

/** 有对应 Tab 的状态卡才可点击切换 */
const TAB_KEYS: string[] = ['ship', 'return'];

function Ship() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ship');

  // 发货弹窗：目标订单 + 快递公司 + 单号
  const [shipTarget, setShipTarget] = useState<OrderData | null>(null);
  const [express, setExpress] = useState<string>(EXPRESS_OPTIONS[0].value);
  const [trackingNo, setTrackingNo] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllOrders();
        setOrders(res?.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 按状态分组：统计卡计数 + 各 Tab 数据源（后端上分页后应改为条件查询接口）
  const groups = useMemo(() => {
    const by = (s: number) => orders.filter((o) => o.status === s);
    return { 1: by(1), 2: by(2), 3: by(3), 4: by(4) };
  }, [orders]);

  const openShipModal = (r: OrderData) => {
    setShipTarget(r);
    setTrackingNo('');
  };

  const onShipOk = () => {
    const no = trackingNo.trim();
    if (!no) {
      message.warning('请填写快递单号');
      return;
    }
    // TODO 后端发货接口（提交快递公司+单号）就绪后替换为真实请求，成功后刷新列表
    message.success(`【占位】${shipTarget?.orderNo} 已发货：${express} ${no}`);
    setShipTarget(null);
  };

  const shipColumns: TableColumnsType<OrderData> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
      ellipsis: true,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '租期',
      key: 'rent',
      width: 220,
      render: (_, r) => `${r.rentStartDate} ~ ${r.rentEndDate}`,
    },
    {
      title: '实付租金',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 110,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '押金',
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      width: 100,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
  ];

  const returnColumns: TableColumnsType<OrderData> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
      ellipsis: true,
    },
    {
      title: '租期',
      key: 'rent',
      width: 220,
      render: (_, r) => `${r.rentStartDate} ~ ${r.rentEndDate}`,
    },
    {
      title: '归还单号',
      dataIndex: 'trackingNoReturn',
      key: 'trackingNoReturn',
      width: 200,
      render: (v: string | null) =>
        v ? <Tag color="geekblue">{v}</Tag> : <Tag>待用户寄回</Tag>,
    },
    {
      title: '实付租金',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 110,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
  ];

  return (
    <div>
      {/* 列表面板 */}
      <div className={styles.panel}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'ship',
              label: `待发货（${groups[1].length}）`,
              children: (
                <CustomTable
                  bordered
                  rowKey="id"
                  loading={loading}
                  columns={shipColumns}
                  data={groups[1]}
                  actions={[
                    { key: 'ship', label: '发货', onClick: openShipModal },
                  ]}
                  scroll={{ x: 'max-content' }}
                />
              ),
            },
            {
              key: 'return',
              label: `待归还（${groups[3].length}）`,
              children: (
                <CustomTable
                  bordered
                  rowKey="id"
                  loading={loading}
                  columns={returnColumns}
                  data={groups[3]}
                  actions={[
                    {
                      key: 'confirm',
                      label: '确认归还',
                      confirm: '确认衣物已归还入库？',
                      onClick: (r) =>
                        message.success(`【占位】确认归还 ${r.orderNo}`),
                    },
                  ]}
                  scroll={{ x: 'max-content' }}
                />
              ),
            },
          ]}
        />
      </div>

      {/* 发货弹窗：订单摘要 + 快递公司 + 单号 */}
      <Modal
        title="订单发货"
        open={!!shipTarget}
        onOk={onShipOk}
        onCancel={() => setShipTarget(null)}
        okText="确认发货"
        cancelText="取消"
        destroyOnClose
      >
        <Descriptions
          column={1}
          size="small"
          bordered
          style={{ marginBottom: 16 }}
        >
          <Descriptions.Item label="订单号">
            {shipTarget?.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="订单状态">
            {shipTarget ? (
              <Tag color={ORDER_STATUS[shipTarget.status]?.color}>
                {ORDER_STATUS[shipTarget.status]?.text}
              </Tag>
            ) : null}
          </Descriptions.Item>
          <Descriptions.Item label="租期">
            {shipTarget &&
              `${shipTarget.rentStartDate} ~ ${shipTarget.rentEndDate}`}
          </Descriptions.Item>
          <Descriptions.Item label="实付租金 / 押金">
            {shipTarget &&
              `¥${shipTarget.totalAmount.toFixed(
                2,
              )} / ¥${shipTarget.depositAmount.toFixed(2)}`}
          </Descriptions.Item>
        </Descriptions>
        <Select
          style={{ width: '100%' }}
          value={express}
          onChange={setExpress}
          options={EXPRESS_OPTIONS}
        />
        <Input
          style={{ marginTop: 12 }}
          placeholder="请输入快递单号"
          value={trackingNo}
          onChange={(e) => setTrackingNo(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Ship;
