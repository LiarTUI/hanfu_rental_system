import { getAllOrders, getReviewsByOrder } from '@/services/orders';
import type { TableColumnsType } from 'antd';
import { Descriptions, Modal, Rate, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import styles from './index.less';
import { ORDER_STATUS, type OrderData, type ReviewData } from './type';

// 金额统一两位小数；空值兜底为 -
const fmtMoney = (v: number | null | undefined) =>
  v == null ? '-' : `¥${v.toFixed(2)}`;

function List() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  // 当前查看的订单；非空即弹窗打开
  const [detailRecord, setDetailRecord] = useState<OrderData | null>(null);
  // 详情弹窗内的用户评价（原独立"用户评价"页面已并入此处）
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
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
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 90,
    },
    {
      title: '店铺ID',
      dataIndex: 'storeId',
      key: 'storeId',
      width: 90,
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
    {
      title: '发货物流',
      dataIndex: 'trackingNoSend',
      key: 'trackingNoSend',
      width: 150,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: '归还物流',
      dataIndex: 'trackingNoReturn',
      key: 'trackingNoReturn',
      width: 150,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
  ];

  useEffect(() => {
    initData();
  }, []);

  // 打开详情弹窗时按订单拉取评价；关闭时清空，避免串单
  useEffect(() => {
    if (!detailRecord) {
      setReviews([]);
      return;
    }
    setReviewsLoading(true);
    getReviewsByOrder(detailRecord.id)
      .then((res) => setReviews(res?.data ?? []))
      .finally(() => setReviewsLoading(false));
  }, [detailRecord]);

  const initData = async () => {
    const res = await getAllOrders();
    // umi request 返回整个响应对象，订单列表在 res.data 里
    setOrders(res?.data ?? []);
  };

  return (
    <div className={styles.tableContainer}>
      <CustomTable
        bordered
        rowKey="id"
        columns={columns}
        data={orders}
        // 平铺搜索区：每字段一个独立搜索框（多框 AND，客户端过滤）
        searchFields={[
          { field: 'orderNo', label: '订单号' },
          { field: 'userId', label: '用户ID' },
          { field: 'storeId', label: '店铺ID' },
        ]}
        // 操作列：详情（全状态）、关闭（危险+确认）；发货已移交商家端
        // 后端修改类接口就绪前先占位，onClick 里接真实请求
        actions={[
          {
            key: 'detail',
            label: '查看',
            onClick: (r) => setDetailRecord(r),
          },
        ]}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        title={`订单详情 ${detailRecord?.orderNo ?? ''}`}
        open={!!detailRecord}
        width={560}
        okText="关闭"
        onOk={() => setDetailRecord(null)}
        onCancel={() => setDetailRecord(null)}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {detailRecord && (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="订单号" span={2}>
                {detailRecord.orderNo}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                {(() => {
                  const s = ORDER_STATUS[detailRecord.status];
                  return s ? (
                    <Tag color={s.color}>{s.text}</Tag>
                  ) : (
                    detailRecord.status
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">
                {detailRecord.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {detailRecord.userId}
              </Descriptions.Item>
              <Descriptions.Item label="店铺ID">
                {detailRecord.storeId}
              </Descriptions.Item>
              <Descriptions.Item label="租赁档期" span={2}>
                {detailRecord.rentStartDate} ~ {detailRecord.rentEndDate}
              </Descriptions.Item>
              <Descriptions.Item label="实付租金">
                {fmtMoney(detailRecord.totalAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="押金">
                {fmtMoney(detailRecord.depositAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="平台佣金">
                {fmtMoney(detailRecord.platformCommission)}
              </Descriptions.Item>
              <Descriptions.Item label="商家入账">
                {fmtMoney(detailRecord.merchantIncome)}
              </Descriptions.Item>
              <Descriptions.Item label="发货物流" span={2}>
                {detailRecord.trackingNoSend ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="归还物流" span={2}>
                {detailRecord.trackingNoReturn ?? '—'}
              </Descriptions.Item>
            </Descriptions>
            {/* 用户评价：原独立页面已并入详情，随订单实时拉取 */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>用户评价</div>
              {reviewsLoading ? (
                <div style={{ color: '#999' }}>加载中…</div>
              ) : reviews.length ? (
                reviews.map((rv) => (
                  <div
                    key={rv.reviewId}
                    style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <Rate
                        disabled
                        value={rv.rating}
                        style={{ fontSize: 14 }}
                      />
                      <span style={{ color: '#999', fontSize: 12 }}>
                        {rv.createTime}
                      </span>
                    </div>
                    <div style={{ marginTop: 4 }}>{rv.content || '—'}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#999' }}>暂无评价</div>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default List;
