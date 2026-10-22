import { getAllProducts } from '@/services/products';
import type { TableColumnsType } from 'antd';
import { Image, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import type { ProductData } from './type';

/** 从已加载数据里派生枚举列的筛选项（类目/形制是后端自由字符串，无固定字典） */
const deriveFilters = (list: ProductData[], field: 'category' | 'dynasty') =>
  [...new Set(list.map((p) => p[field]).filter(Boolean))].map((v) => ({
    text: v,
    value: v,
  }));

function ProductList() {
  const [products, setProducts] = useState<ProductData[]>([]);

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

  return (
    <div>
      <CustomTable
        bordered
        rowKey="id"
        columns={columns}
        data={products}
        // 平铺搜索区：每字段一个独立搜索框（多框 AND，客户端过滤）
        searchFields={[
          { field: 'name', label: '商品名称' },
          { field: 'category', label: '类目' },
          { field: 'dynasty', label: '形制' },
        ]}
        scroll={{ x: 'max-content' }}
        actions={[
          {
            key: 'detail',
            label: '查看',
            onClick: (r) => console.log(r),
          },
          {
            key: 'upAndDown', //上下架
            label: (record) => (record.status === 0 ? '上架' : '下架'),
            onClick: (r) => console.log(r),
          },
        ]}
      />
    </div>
  );
}

export default ProductList;
