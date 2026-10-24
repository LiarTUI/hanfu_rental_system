import { getAllUsers, updateUserStatus } from '@/services/users';
import { UserOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Avatar, Descriptions, Modal, Space, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import type { UserData } from './type';

/** 信用分 → 颜色（芝麻分式 350~950，越高越好） */
const creditColor = (v: number) =>
  v >= 700 ? 'green' : v >= 550 ? 'blue' : 'red';

export default function MemberList() {
  const [members, setMembers] = useState<UserData[]>([]);
  // 当前查看的用户；非空即弹窗打开
  const [detailRecord, setDetailRecord] = useState<UserData | null>(null);

  const columns: TableColumnsType<UserData> = [
    {
      title: '用户',
      key: 'username',
      dataIndex: 'username',
      width: 220,
      ellipsis: true,
      render: (name, r) => (
        <Space>
          {/* avatar 为相对路径走 dev proxy；缺失或加载失败自动回退人形图标 */}
          <Avatar src={r.avatar ?? undefined} icon={<UserOutlined />} />
          {name}
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'phone',
      dataIndex: 'phone',
      width: 160,
    },
    {
      title: '身高/体重',
      key: 'body',
      width: 130,
      render: (_, r) =>
        r.height != null && r.weight != null
          ? `${r.height}cm / ${r.weight}kg`
          : '—',
    },
    {
      title: '三围',
      key: 'measurements',
      width: 120,
      // 胸-腰-臀，单位 cm；三项齐全才展示，缺一则兜底 —
      render: (_, r) =>
        r.bust != null && r.waist != null && r.hip != null
          ? `${r.bust}-${r.waist}-${r.hip}`
          : '—',
    },
    {
      title: '体型',
      key: 'bodyShape',
      dataIndex: 'bodyShape',
      width: 100,
      render: (v: string | null) =>
        v ? <Tag>{v === '纸片人' ? '纤细型' : v}</Tag> : '—',
    },
    {
      title: '信用分',
      key: 'creditScore',
      dataIndex: 'creditScore',
      width: 100,
      render: (v: number | undefined) =>
        v != null ? <Tag color={creditColor(v)}>{v}</Tag> : '—',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 90,
      render: (v: number | undefined) =>
        v === 0 ? <Tag color="red">封禁</Tag> : <Tag color="green">正常</Tag>,
    },
    {
      title: '注册时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '最近登录',
      key: 'lastLoginTime',
      dataIndex: 'lastLoginTime',
      width: 180,
      render: (v: string | undefined) => v ?? '—',
    },
  ];

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    const res = await getAllUsers();
    // umi request 返回整个响应对象,列表在 res.data 里;直接 setMembers(res)
    // 会把对象喂给 dataSource,Table 内部调 .some 就崩
    setMembers(res?.data ?? []);
  };

  // 封禁/解封：切换 status（1=正常 0=封禁），成功后刷新列表
  const handleToggleStatus = async (r: UserData) => {
    const next = r.status === 0 ? 1 : 0;
    const res = await updateUserStatus(r.userId, next);
    if (res?.success) {
      message.success(next === 0 ? '已封禁' : '已解封');
      initData();
    } else {
      message.error(res?.errorMsg ?? '操作失败');
    }
  };

  return (
    <div>
      <CustomTable
        bordered
        rowKey="userId"
        columns={columns}
        data={members}
        // 平铺搜索区：每字段一个独立搜索框（多框 AND，客户端过滤）
        searchFields={[
          { field: 'username', label: '用户名' },
          { field: 'phone', label: '手机号' },
        ]}
        scroll={{ x: 'max-content' }}
        actions={[
          {
            key: 'detail',
            label: '查看',
            onClick: (r) => setDetailRecord(r),
          },
          {
            key: 'toggleStatus',
            // 封禁是危险操作标红并二次确认；解封普通操作也确认一次防误触
            label: (r) => (r.status === 0 ? '解封' : '封禁'),
            danger: (r) => r.status !== 0,
            confirm: (r) =>
              r.status === 0
                ? `确认解封用户「${r.username}」？`
                : `确认封禁用户「${r.username}」？封禁后该用户将无法登录`,
            onClick: (r) => handleToggleStatus(r),
          },
        ]}
      />
      <Modal
        title={`用户详情 ${detailRecord?.username ?? ''}`}
        open={!!detailRecord}
        width={560}
        okText="关闭"
        onOk={() => setDetailRecord(null)}
        onCancel={() => setDetailRecord(null)}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {detailRecord && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="用户" span={2}>
              <Space>
                <Avatar
                  src={detailRecord.avatar ?? undefined}
                  icon={<UserOutlined />}
                />
                {detailRecord.username}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="手机号" span={2}>
              {detailRecord.phone}
            </Descriptions.Item>
            <Descriptions.Item label="身高/体重">
              {detailRecord.height != null && detailRecord.weight != null
                ? `${detailRecord.height}cm / ${detailRecord.weight}kg`
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="三围">
              {detailRecord.bust != null &&
              detailRecord.waist != null &&
              detailRecord.hip != null
                ? `${detailRecord.bust}-${detailRecord.waist}-${detailRecord.hip}`
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="体型">
              {detailRecord.bodyShape ? (
                <Tag>{detailRecord.bodyShape}</Tag>
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="信用分">
              {detailRecord.creditScore != null ? (
                <Tag color={creditColor(detailRecord.creditScore)}>
                  {detailRecord.creditScore}
                </Tag>
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {detailRecord.status === 0 ? (
                <Tag color="red">封禁</Tag>
              ) : (
                <Tag color="green">正常</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="最近登录" span={2}>
              {detailRecord.lastLoginTime ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间" span={2}>
              {detailRecord.createTime ?? '—'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
