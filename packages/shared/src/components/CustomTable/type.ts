import type { TableColumnType, TableProps } from 'antd';
type extendProp = {
  data?: any[];
};

type ExtraColumnProps = {};
export type customTableProps = TableProps & extendProp;

export type MyTableColumnType<T> = TableColumnType<T> & ExtraColumnProps;
