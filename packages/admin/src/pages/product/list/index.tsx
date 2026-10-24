import { getAllProducts } from '@/services/products';
import type { TableColumnsType } from 'antd';
import { Descriptions, Image, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import { AUDIT_STATUS, RENT_UNIT, type ProductData } from './type';

/** 从已加载数据里派生枚举列的筛选项（类目/形制是后端自由字符串，无固定字典） */
const deriveFilters = (list: ProductData[], field: 'category' | 'dynasty') =>
  [...new Set(list.map((p) => p[field]).filter(Boolean))].map((v) => ({
    text: v,
    value: v,
  }));

// 金额统一两位小数；空值兜底为 -
const fmtMoney = (v: number | null | undefined) =>
  v == null ? '-' : `¥${v.toFixed(2)}`;

function ProductList() {
  const [products, setProducts] = useState<ProductData[]>([]);
  // 当前查看的商品；非空即弹窗打开
  const [detailRecord, setDetailRecord] = useState<ProductData | null>(null);

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
      title: '店铺ID',
      dataIndex: 'storeId',
      key: 'storeId',
      width: 90,
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
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
    },
    {
      title: '评分',
      key: 'rating',
      width: 110,
      render: (_: any, record: ProductData) =>
        record.rating == null
          ? '—'
          : `${record.rating.toFixed(1)}分 (${record.reviewCount ?? 0}评)`,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 110,
      render: (v: number) => {
        const s = AUDIT_STATUS[v];
        return s ? <Tag color={s.color}>{s.text}</Tag> : v;
      },
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
            onClick: (r) => setDetailRecord(r),
          },
          {
            key: 'upAndDown', //上下架
            label: (record) => (record.status === 0 ? '上架' : '下架'),
            onClick: (r) => console.log(r),
          },
        ]}
      />
      <Modal
        title={`商品详情 ${detailRecord?.name ?? ''}`}
        open={!!detailRecord}
        width={600}
        okText="关闭"
        onOk={() => setDetailRecord(null)}
        onCancel={() => setDetailRecord(null)}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {detailRecord && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="商品名称" span={2}>
              {detailRecord.name}
            </Descriptions.Item>
            <Descriptions.Item label="封面" span={2}>
              {detailRecord.coverUrl ? (
                <Image src={detailRecord.coverUrl} width={96} />
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="店铺ID">
              {detailRecord.storeId}
            </Descriptions.Item>
            <Descriptions.Item label="库存">
              {detailRecord.stock}
            </Descriptions.Item>
            <Descriptions.Item label="评分">
              {detailRecord.rating == null
                ? '—'
                : `${detailRecord.rating.toFixed(1)}分 (${
                    detailRecord.reviewCount ?? 0
                  }评)`}
            </Descriptions.Item>
            <Descriptions.Item label="类目">
              {detailRecord.category}
            </Descriptions.Item>
            <Descriptions.Item label="形制">
              {detailRecord.dynasty}
            </Descriptions.Item>
            <Descriptions.Item label="颜色">
              {detailRecord.color || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="上下架">
              {detailRecord.status === 1 ? (
                <Tag color="green">上架</Tag>
              ) : (
                <Tag>下架</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="审核状态">
              {(() => {
                const s = AUDIT_STATUS[detailRecord.auditStatus];
                return s ? (
                  <Tag color={s.color}>{s.text}</Tag>
                ) : (
                  detailRecord.auditStatus
                );
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="审核备注" span={2}>
              {detailRecord.auditRemark || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="租金">
              {`${fmtMoney(detailRecord.rentPrice)} / ${
                RENT_UNIT[detailRecord.rentUnit] ?? ''
              }`}
            </Descriptions.Item>
            <Descriptions.Item label="起租期">
              {detailRecord.minRentPeriod != null
                ? `${detailRecord.minRentPeriod} ${
                    RENT_UNIT[detailRecord.rentUnit] ?? ''
                  }`
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="押金">
              {fmtMoney(detailRecord.deposit)}
            </Descriptions.Item>
            <Descriptions.Item label="洗涤费">
              {fmtMoney(detailRecord.cleaningFee)}
            </Descriptions.Item>
            <Descriptions.Item label="适合身高" span={2}>
              {detailRecord.suitableHeightMin != null &&
              detailRecord.suitableHeightMax != null
                ? `${detailRecord.suitableHeightMin} ~ ${detailRecord.suitableHeightMax} cm`
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="适合体型" span={2}>
              {detailRecord.suitableBodyShape ? (
                <span>
                  {detailRecord.suitableBodyShape.split(',').map((s) => (
                    <Tag key={s}>{s.trim()}</Tag>
                  ))}
                </span>
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="商品描述" span={2}>
              {detailRecord.description || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {detailRecord.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="最近更新">
              {detailRecord.updateTime}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default ProductList;
