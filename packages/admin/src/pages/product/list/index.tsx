import { useTableSearch } from '@/hooks/useTableSearch';
import { getAllProducts } from '@/services/products';
import type { TableColumnsType } from 'antd';
import { Image, Input, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import type { ProductData } from './type';

/** 从已加载数据里派生枚举列的筛选项（类目/形制是后端自由字符串，无固定字典） */
const deriveFilters = (list: ProductData[], field: 'category' | 'dynasty') =>
  [...new Set(list.map((p) => p[field]).filter(Boolean))].map((v) => ({
    text: v,
    value: v,
  }));

// 搜索范围限定：选中的字段才参与关键词匹配
const SEARCH_FIELDS: { label: string; value: keyof ProductData }[] = [
  { label: '商品名称', value: 'name' },
  { label: '类目', value: 'category' },
  { label: '形制', value: 'dynasty' },
];

function ProductList() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [searchField, setSearchField] = useState<keyof ProductData>('name');
  // 关键词搜索（客户端过滤），范围由 searchField 限定
  const { keyword, setKeyword, filtered } = useTableSearch(products, [
    searchField,
  ]);

  // 短内容列定宽防止加载/筛选时列宽跳动；
  // 标注 TableColumnsType 后 onFilter/render 的参数自动获得类型
  const columns: TableColumnsType<ProductData> = [
    {
      title: '封面',
      dataIndex: 'coverUrl',
      key: 'coverUrl',
      width: 80,
      render: (v: string) => (v ? <Image src={v} width={48} /> : '-'),
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      ellipsis: true,
    },
    {
      title: '类目',
      dataIndex: 'category',
      key: 'category',
      width: 110,
      filters: deriveFilters(products, 'category'),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '形制',
      dataIndex: 'dynasty',
      key: 'dynasty',
      width: 110,
      filters: deriveFilters(products, 'dynasty'),
      onFilter: (value, record) => record.dynasty === value,
    },
    {
      title: '租金',
      dataIndex: 'rentPrice',
      key: 'rentPrice',
      width: 110,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '押金',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 100,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '上架', value: 1 },
        { text: '下架', value: 0 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (v: number) =>
        v === 1 ? <Tag color="green">上架</Tag> : <Tag>下架</Tag>,
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
    const res = await getAllProducts();
    // umi request 返回整个响应对象，商品列表在 res.data 里
    setProducts(res?.data ?? []);
  };

  // 切换搜索范围时清空关键词，避免旧词在新字段下显示为空造成困惑
  const onFieldChange = (field: keyof ProductData) => {
    setSearchField(field);
    setKeyword('');
  };

  return (
    <div>
      <Space.Compact style={{ width: 320, marginBottom: 16 }}>
        <Select
          value={searchField}
          onChange={onFieldChange}
          options={SEARCH_FIELDS}
          style={{ width: 100 }}
        />
        <Input.Search
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
          placeholder={`搜索${
            SEARCH_FIELDS.find((f) => f.value === searchField)?.label ?? ''
          }`}
        />
      </Space.Compact>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

export default ProductList;
