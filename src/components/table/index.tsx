import { Table} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';

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
  loading?: boolean,
  scrollY?: number
}

const TableGeneral = (props: TableProps) => {
  const {data, columns, pagination, rowSelection, handleOnChangeTable , customCss, loading, scrollY} = props
  const { t } = useTranslation()

  const itemRender = (_: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return <a><LeftOutlined /> {t('pagination.back')}</a>;
    }
    if (type === "next") {
      return <a>{t('pagination.next')} <RightOutlined/></a>;
    }
    
    return originalElement;
  };

  const tablePagination = pagination ? {
    showSizeChanger: true,
    // showQuickJumper: true,
    pageSizeOptions: ['10', '30', '50', '100'],
    total: pagination.total ? pagination.total : "",
    current: pagination.current ? pagination.current : "",
    pageSize: pagination.pageSize ? pagination.pageSize : "",
    itemRender: itemRender,
  } : false

  return (
    <div className='custom-table'>
      <Table
        loading={loading}
        bordered
        rowKey={(record) => record.id || record.campaignId}
        className={`${customCss ? customCss : ""}`}
        dataSource={data}
        columns={columns ? columns.map((column: any) => ({
          ...column,
        })) : []}
        pagination={tablePagination}
        rowSelection={rowSelection ? rowSelection : null}
        onChange={handleOnChangeTable}
        scroll={{x: true, y: scrollY ? scrollY : undefined}}
        locale={{
          emptyText: t('commons.no_data'),
        }}
      />
    </div>
  )
};

export default TableGeneral;