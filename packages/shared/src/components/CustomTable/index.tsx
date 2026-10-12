import { ConfigProvider, Table } from 'antd';
import type { customTableProps } from './type';
export default function CustomTable(props: customTableProps) {
  const { data, columns, bordered } = props;
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {},
        },
      }}
    >
      <Table
        {...props}
        dataSource={data}
        columns={columns}
        bordered={bordered}
      />
    </ConfigProvider>
  );
}
