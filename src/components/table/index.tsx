import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import styles from './index.module.scss'

interface DataType {
  title: string;
  dataIndex: any;
  key: string;
  sortBy?: any,
  onChangeSort?: () => void,
  align?: string
}

interface TableProps {
  data: any;
  columns: DataType[],
  pagination?: any,
  rowSelection?: any,
  handleOnChangeTable?: (pagination:any, filters:any, sorter:any) => void
  customCss?: string,
  loading: boolean
}

const TableGeneral = (props: TableProps) => {
  const {data, columns, pagination, rowSelection, handleOnChangeTable , customCss, loading} = props
  return (
    <div>
      <Table
        loading={loading}
        bordered
        rowKey={(record) => record.id || record.campaignId}
        className={`mt-6 ${customCss}`}
        dataSource={data}
        columns={columns ? columns.map((column: any) => ({
          ...column,
        })) : []}
        pagination={pagination}
        rowSelection={rowSelection ? rowSelection : null}
        onChange={handleOnChangeTable}
        scroll={{x: true}}
      />
    </div>
  )
};

export default TableGeneral;