import { getStores } from '@/services/store';
import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import type { StoreData } from './type';

function StoreList() {
  const [stores, setStores] = useState<StoreData[]>([]);

  const columns = [
    { title: '店铺名称', dataIndex: 'name', key: 'name' },
    { title: '联系人', dataIndex: 'contactName', key: 'contactName' },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    {
      title: '佣金率',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      // 约定口径 0.10 = 10%；后端若给了非数字（字段名不符/"10%" 字符串等），
      // 回退显示原值，避免整列 NaN
      render: (v: number | string | null) => {
        if (v === null || v === undefined || v === '') return '-';
        const n = Number(v);
        return Number.isNaN(n)
          ? String(v)
          : `${(n * 100).toFixed(1).replace(/\.0$/, '')}%`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: number) =>
        v === 1 ? <Tag color="green">营业中</Tag> : <Tag>离线</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const res = await getStores();
    // umi request 返回整个响应对象，店铺列表在 res.data 里
    setStores(res?.data ?? []);
  };

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={stores} />
    </div>
  );
}

export default StoreList;
