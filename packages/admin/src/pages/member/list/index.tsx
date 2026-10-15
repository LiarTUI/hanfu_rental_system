import { getAllUsers } from '@/services/users';
import { UserOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Avatar, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CustomTable } from 'shared';
import type { UserData } from './type';

/** 信用分 → 颜色（芝麻分式 350~950，越高越好） */
const creditColor = (v: number) =>
  v >= 700 ? 'green' : v >= 550 ? 'blue' : 'red';

export default function MemberList() {
  const [members, setMembers] = useState<UserData[]>([]);

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
      title: '体型',
      key: 'bodyShape',
      dataIndex: 'bodyShape',
      width: 100,
      render: (v: string | null) => (v ? <Tag>{v}</Tag> : '—'),
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
      title: '注册时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 180,
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
      />
    </div>
  );
}
