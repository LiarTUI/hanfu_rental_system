import { getStores } from '@/services/store';
import type { TableColumnsType } from 'antd';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import type { StoreData } from './type';

function StoreList() {
  const [stores, setStores] = useState<StoreData[]>([]);

  // 短内容列定宽防止加载/筛选时列宽跳动；名称/地址长文本列不定宽，弹性吸收剩余空间
  // 标注 TableColumnsType 后 onFilter/render 的参数自动获得类型
  const columns: TableColumnsType<StoreData> = [
    {
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 140,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '佣金率',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      width: 100,
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
      width: 110,
      filters: [
        { text: '营业中', value: 1 },
        { text: '离线', value: 0 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (v: number) =>
        v === 1 ? <Tag color="green">营业中</Tag> : <Tag>离线</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
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
      <CustomTable
        bordered
        rowKey="id"
        columns={columns}
        data={stores}
        // 平铺搜索区：每字段一个独立搜索框（多框 AND，客户端过滤）
        searchFields={[
          { field: 'name', label: '店铺名称' },
          { field: 'contactName', label: '联系人' },
          { field: 'address', label: '地址' },
        ]}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

export default StoreList;
