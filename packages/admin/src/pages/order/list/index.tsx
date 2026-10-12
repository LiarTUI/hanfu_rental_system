import { useTableSearch } from '@/hooks/useTableSearch';
import { getAllOrders } from '@/services/orders';
import type { TableColumnsType } from 'antd';
import { Input, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { ORDER_STATUS, type OrderData } from './type';

// 搜索范围限定：选中的字段才参与关键词匹配
const SEARCH_FIELDS: { label: string; value: keyof OrderData }[] = [
  { label: '订单号', value: 'orderNo' },
  { label: '用户ID', value: 'userId' },
  { label: '店铺ID', value: 'storeId' },
];

function List() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [searchField, setSearchField] = useState<keyof OrderData>('orderNo');
  // 关键词搜索（客户端过滤），范围由 searchField 限定
  const { keyword, setKeyword, filtered } = useTableSearch(orders, [
    searchField,
  ]);

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

  // 切换搜索范围时清空关键词，避免旧词在新字段下显示为空造成困惑
  const onFieldChange = (field: keyof OrderData) => {
    setSearchField(field);
    setKeyword('');
  };

  return (
    <div>
      <Input.Search
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        allowClear
        addonBefore={
          <Select
            value={searchField}
            onChange={onFieldChange}
            options={SEARCH_FIELDS}
            style={{ width: 90 }}
          />
        }
        placeholder={`搜索${
          SEARCH_FIELDS.find((f) => f.value === searchField)?.label ?? ''
        }`}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

export default List;
