import { getAllOrders } from '@/services/orders';
import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { ORDER_STATUS, type OrderData } from './type';

function List() {
  const [orders, setOrders] = useState<OrderData[]>([]);

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: number) => {
        const s = ORDER_STATUS[v];
        return s ? <Tag color={s.color}>{s.text}</Tag> : v;
      },
    },
    { title: '下单时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '租期',
      key: 'rent',
      render: (_: any, record: OrderData) =>
        `${record.rentStartDate} ~ ${record.rentEndDate}`,
    },
    {
      title: '实付租金',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '押金',
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '平台佣金',
      dataIndex: 'platformCommission',
      key: 'platformCommission',
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '商家入账',
      dataIndex: 'merchantIncome',
      key: 'merchantIncome',
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
  ];

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const res = await getAllOrders();
    // umi request 返回整个响应对象，订单列表在 res.data 里
    setOrders(res?.data ?? []);
  };

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={orders} />
    </div>
  );
}

export default List;
