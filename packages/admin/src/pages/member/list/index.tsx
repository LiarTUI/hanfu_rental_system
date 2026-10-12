import { getAllUsers } from '@/services/users';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import type { UserData } from './type';
export default function MemberList() {
  const [members, setMembers] = useState<UserData[]>([]);
  const columns = [
    {
      title: '用户名',
      key: 'username',
      dataIndex: 'username',
    },
    {
      title: '联系方式',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      key: 'createTime',
      dataIndex: 'createTime',
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
      <Table columns={columns} dataSource={members} />
    </div>
  );
}
