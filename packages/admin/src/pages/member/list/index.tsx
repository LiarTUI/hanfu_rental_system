import { useTableSearch } from '@/hooks/useTableSearch';
import { getAllUsers } from '@/services/users';
import { Input, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import type { UserData } from './type';

// 搜索范围限定：选中的字段才参与关键词匹配
const SEARCH_FIELDS: { label: string; value: keyof UserData }[] = [
  { label: '用户名', value: 'username' },
  { label: '手机号', value: 'phone' },
];

export default function MemberList() {
  const [members, setMembers] = useState<UserData[]>([]);
  const [searchField, setSearchField] = useState<keyof UserData>('username');
  // 关键词搜索（客户端过滤），范围由 searchField 限定；无枚举字段不加列筛选
  const { keyword, setKeyword, filtered } = useTableSearch(members, [
    searchField,
  ]);

  const columns = [
    {
      title: '用户名',
      key: 'username',
      dataIndex: 'username',
      width: 200,
      ellipsis: true,
    },
    {
      title: '联系方式',
      key: 'phone',
      dataIndex: 'phone',
      width: 160,
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

  // 切换搜索范围时清空关键词，避免旧词在新字段下显示为空造成困惑
  const onFieldChange = (field: keyof UserData) => {
    setSearchField(field);
    setKeyword('');
  };

  return (
    <div>
      <Input.Search
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        allowClear
        addonBefore={
          <Select
            value={searchField}
            onChange={onFieldChange}
            options={SEARCH_FIELDS}
            style={{ width: 90 }}
          />
        }
        placeholder={`搜索${
          SEARCH_FIELDS.find((f) => f.value === searchField)?.label ?? ''
        }`}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table
        rowKey="userId"
        columns={columns}
        dataSource={filtered}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
