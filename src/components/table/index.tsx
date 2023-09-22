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
  rowSelection?: any,
  handleOnChangeTable?: (pagination:any, filters:any, sorter:any) => void
}

const TableGeneral = (props: TableProps) => {
  const {data, columns, pagination, rowSelection, handleOnChangeTable} = props
  return (
    <div>
      <Table
        bordered
        rowKey="id"
        className='mt-6'
        dataSource={data}
        columns={columns ? columns.map((column: any) => ({
          ...column,
        })) : []}
        pagination={pagination}
        rowSelection={rowSelection ? rowSelection : null}
        onChange={handleOnChangeTable}
      />
    </div>
  )
};

export default TableGeneral;