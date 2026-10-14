import { useTableSearch } from '@/hooks/useTableSearch';
import { getAllProducts, getSkus } from '@/services/products';
import type { TableColumnsType } from 'antd';
import { Input, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { CustomTable } from 'shared';
import type { ProductData } from '../../list/type';
import { CONDITION_STATUS, type SkuData } from './type';

export default function ProductSku() {
  const [skus, setSkus] = useState<SkuData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  // 只搜 SKU 编码一个字段，无需范围下拉
  const { keyword, setKeyword, filtered } = useTableSearch(skus, ['skuCode']);

  // productId → 商品名：列表里不展示裸 ID
  const productNameMap = useMemo(() => {
    const m = new Map<number, string>();
    products.forEach((p) => m.set(p.id, p.name));
    return m;
  }, [products]);

  const columns: TableColumnsType<SkuData> = [
    {
      title: 'SKU 编码',
      dataIndex: 'skuCode',
      key: 'skuCode',
      width: 180,
      ellipsis: true,
    },
    {
      title: '商品',
      key: 'product',
      width: 240,
      ellipsis: true,
      render: (_, r) =>
        productNameMap.get(r.productId) ?? `#商品${r.productId}`,
    },
    {
      title: '尺码',
      dataIndex: 'size',
      key: 'size',
      width: 90,
      // 尺码集合随数据动态去重，不写死
      filters: [...new Set(skus.map((s) => s.size))].map((v) => ({
        text: v,
        value: v,
      })),
      onFilter: (value, record) => record.size === value,
    },
    {
      title: '成色',
      dataIndex: 'conditionStatus',
      key: 'conditionStatus',
      width: 110,
      filters: Object.entries(CONDITION_STATUS).map(([value, s]) => ({
        text: s.text,
        value: Number(value),
      })),
      onFilter: (value, record) => record.conditionStatus === value,
      render: (v: number) => {
        const s = CONDITION_STATUS[v];
        return s ? <Tag color={s.color}>{s.text}</Tag> : v;
      },
    },
    {
      title: '入库时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '最近更新',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        // 台账 + 商品名映射并行拉取（后端均按时间倒序/全量返回）
        const [skuRes, productRes] = await Promise.all([
          getSkus(),
          getAllProducts(),
        ]);
        setSkus(skuRes?.data ?? []);
        setProducts(productRes?.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <Input.Search
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        allowClear
        placeholder="搜索SKU编码"
        style={{ width: 300, marginBottom: 16 }}
      />
      <CustomTable
        bordered
        rowKey="id"
        loading={loading}
        columns={columns}
        data={filtered}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
