import { getAllOrders } from '@/services/orders';
import type { TableColumnsType } from 'antd';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import styles from './index.less';
import { ORDER_STATUS, type OrderData } from './type';

function List() {
  const [orders, setOrders] = useState<OrderData[]>([]);

  // 短内容列定宽防止加载/筛选时列宽跳动；
  // 标注 TableColumnsType 后 onFilter/render 的参数自动获得类型
  const columns: TableColumnsType<OrderData> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 190,
      ellipsis: true,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      filters: Object.entries(ORDER_STATUS).map(([value, s]) => ({
        text: s.text,
        value: Number(value),
      })),
      // 7 个状态选项较多，下拉面板内自带搜索
      filterSearch: true,
      onFilter: (value, record) => record.status === value,
      render: (v: number) => {
        const s = ORDER_STATUS[v];
        return s ? <Tag color={s.color}>{s.text}</Tag> : v;
      },
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
      width: 230,
      render: (_: any, record: OrderData) =>
        `${record.rentStartDate} ~ ${record.rentEndDate}`,
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
    {
      title: '平台佣金',
      dataIndex: 'platformCommission',
      key: 'platformCommission',
      width: 110,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '商家入账',
      dataIndex: 'merchantIncome',
      key: 'merchantIncome',
      width: 110,
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
      <div className={styles.tableContainer}>
        <CustomTable
          bordered
          rowKey="id"
          columns={columns}
          data={orders}
          // 平铺搜索区：每字段一个独立搜索框（多框 AND，客户端过滤）
          searchFields={[
            { field: 'orderNo', label: '订单号' },
            { field: 'userId', label: '用户ID' },
            { field: 'storeId', label: '店铺ID' },
          ]}
          // 操作列：详情（全状态）、发货（仅待发货）、关闭（危险+确认）
          // 后端修改类接口就绪前先占位，onClick 里接真实请求
          actions={[
            {
              key: 'detail',
              label: '详情',
              onClick: (r) => console.log('订单详情', r.id),
            },
            {
              key: 'close',
              label: '关闭',
              danger: true,
              confirm: '确定关闭该订单？',
              onClick: (r) => console.log('关闭订单', r.id),
            },
          ]}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
}

export default List;
