import { createMerchant, getStores } from '@/services/store';
import type { TableColumnsType } from 'antd';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Tag,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import type { StoreData } from './type';

function StoreList() {
  const [stores, setStores] = useState<StoreData[]>([]);
  // 新建商家弹窗
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  type CreateFormValues = {
    phone: string;
    name: string;
    contactName?: string;
    address?: string;
    /** 表单里按百分数填（如 12 表示 12%），提交时换算成 0.12 */
    commissionRate?: number;
  };
  const [form] = Form.useForm<CreateFormValues>();

  // 短内容列定宽防止加载/筛选时列宽跳动；名称/地址长文本列不定宽，弹性吸收剩余空间
  // 标注 TableColumnsType 后 onFilter/render 的参数自动获得类型
  const columns: TableColumnsType<StoreData> = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 80,
      render: (v: string | null) => (v ? <Image src={v} width={48} /> : '-'),
    },
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
      title: '在租商品',
      dataIndex: 'rentingProductCount',
      key: 'rentingProductCount',
      width: 100,
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
        v === 1 ? <Tag color="green">营业中</Tag> : <Tag>封禁</Tag>,
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

  // 新建商家：手机号即默认账号，密码由后端设默认值；佣金率按百分数填写，提交换算为小数
  const handleCreate = async () => {
    const { phone, name, contactName, address, commissionRate } =
      await form.validateFields();
    setSubmitting(true);
    try {
      const res = await createMerchant({
        phone,
        name,
        contactName,
        address,
        commissionRate:
          commissionRate != null ? commissionRate / 100 : undefined,
      });
      if (res?.success) {
        message.success('商家创建成功');
        setCreateOpen(false);
        initData();
      } else {
        message.error(res?.errorMsg ?? '创建失败');
      }
    } finally {
      setSubmitting(false);
    }
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
        toolbar={
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setCreateOpen(true);
            }}
          >
            新建商家
          </Button>
        }
      />
      <Modal
        title="新建商家"
        open={createOpen}
        okText="创建"
        confirmLoading={submitting}
        onOk={handleCreate}
        onCancel={() => setCreateOpen(false)}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="商家手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的11位手机号',
                  },
                ]}
              >
                <Input maxLength={11} placeholder="作为商家默认账号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="店铺名称"
                rules={[{ required: true, message: '请输入店铺名称' }]}
              >
                <Input maxLength={30} placeholder="请输入店铺名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactName"
                label="联系人"
                rules={[{ max: 20, message: '最长20个字符' }]}
              >
                <Input placeholder="选填" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="commissionRate" label="佣金率">
                <InputNumber
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                  placeholder="选填，默认平台标准"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="address"
                label="店铺地址"
                rules={[{ max: 100, message: '最长100个字符' }]}
              >
                <Input placeholder="选填" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <p style={{ color: '#999', marginBottom: 0 }}>
          手机号将作为商家默认账号；密码为系统默认值，商家登录后可自行修改，其余信息商家后续可补充完善。
        </p>
      </Modal>
    </div>
  );
}

export default StoreList;
