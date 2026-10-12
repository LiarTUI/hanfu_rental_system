import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import type { StoreData } from './type';

// TODO 后端接口就绪后，把 setStores(mockStores) 换成
// const res = await getStores(); setStores(res?.data ?? [])
// （getStores 已存在于 @/services/store，路径 /api/store/list）
const mockStores: StoreData[] = [
  {
    id: 1,
    name: '华衿旗舰店',
    address: '杭州市西湖区文三路 100 号',
    status: 1,
    createTime: '2026-08-01 09:00:00',
  },
  {
    id: 2,
    name: '云锦小铺',
    address: '苏州市姑苏区平江路 22 号',
    status: 1,
    createTime: '2026-08-15 16:30:00',
  },
  {
    id: 3,
    name: '苏绣工坊',
    address: '南京市秦淮区夫子庙 8 号',
    status: 0,
    createTime: '2026-09-02 11:20:00',
  },
];

function StoreList() {
  const [stores, setStores] = useState<StoreData[]>([]);

  const columns = [
    { title: '店铺名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'address', key: 'address' },
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
    setStores(mockStores);
  }, []);

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={stores} />
    </div>
  );
}

export default StoreList;
