import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

interface DataType {
  title: string;
  dataIndex: any;
  key: string;
  sortBy?: any,
  onChangeSort?: () => void,
}

interface TableProps {
  data: any;
  columns: DataType[],
  pagination?: any,
  rowSelection?: any
}

const TableGeneral = (props: TableProps) => {
  const {data, columns, pagination, rowSelection} = props
  return (
    <div>
      <Table
        rowKey="id"
        className='mt-6'
        dataSource={data}
        columns={columns ? columns.map((column: any) => ({
          ...column,
        })) : []}
        pagination={pagination}
        rowSelection={rowSelection ? rowSelection : null}
      />
    </div>
  )
};

export default TableGeneral;