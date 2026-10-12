import { getAllProducts } from '@/services/products';
import { Image, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import type { ProductData } from './type';

function ProductList() {
  const [products, setProducts] = useState<ProductData[]>([]);

  const columns = [
    {
      title: '封面',
      dataIndex: 'coverUrl',
      key: 'coverUrl',
      render: (v: string) => (v ? <Image src={v} width={48} /> : '-'),
    },
    { title: '商品名称', dataIndex: 'name', key: 'name' },
    { title: '类目', dataIndex: 'category', key: 'category' },
    { title: '形制', dataIndex: 'dynasty', key: 'dynasty' },
    {
      title: '租金',
      dataIndex: 'rentPrice',
      key: 'rentPrice',
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '押金',
      dataIndex: 'deposit',
      key: 'deposit',
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: number) =>
        v === 1 ? <Tag color="green">上架</Tag> : <Tag>下架</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
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
      <Table rowKey="id" columns={columns} dataSource={products} />
    </div>
  );
}

export default ProductList;
