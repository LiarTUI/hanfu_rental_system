import { useTableSearch } from '@/hooks/useTableSearch';
import { getStores } from '@/services/store';
import type { TableColumnsType } from 'antd';
import { Input, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import type { StoreData } from './type';

// 搜索范围限定：选中的字段才参与关键词匹配
const SEARCH_FIELDS: { label: string; value: keyof StoreData }[] = [
  { label: '店铺名称', value: 'name' },
  { label: '联系人', value: 'contactName' },
  { label: '地址', value: 'address' },
];

function StoreList() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [searchField, setSearchField] = useState<keyof StoreData>('name');
  // 关键词搜索（客户端过滤），范围由 searchField 限定
  const { keyword, setKeyword, filtered } = useTableSearch(stores, [
    searchField,
  ]);

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

  // 切换搜索范围时清空关键词，避免旧词在新字段下显示为空造成困惑
  const onFieldChange = (field: keyof StoreData) => {
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
            style={{ width: 100 }}
          />
        }
        placeholder={`搜索${
          SEARCH_FIELDS.find((f) => f.value === searchField)?.label ?? ''
        }`}
        style={{ width: 340, marginBottom: 16 }}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

export default StoreList;
