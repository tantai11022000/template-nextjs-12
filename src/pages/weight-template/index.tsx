import React, { useEffect, useMemo, useState } from 'react';
import qs from 'query-string';
import RootLayout from '../../components/layout';
import DashboardLayout from '../../components/nested-layout/DashboardLayout';
import { Space } from 'antd';
import TableGeneral from '@/components/table';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';
import { useRouter } from 'next/router';
import { BREADCRUMB_WEIGHT_TEMPLATE } from '@/Constant/index';
import { useAppDispatch } from '@/store/hook';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import SearchInput from '@/components/commons/textInputs/SearchInput';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { PlusOutlined } from '@ant-design/icons';


const fakeData = [
  {
    id: 1,
    name: "Template 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus et veritatis voluptatum animi ipsum facilis at asperiores a. Nihil assumenda corporis ipsa debitis tenetur expedita, numquam magnam? Aliquid, modi obcaecati!",
    updatedAt: "2023-01-01"
  },
  {
    id: 2,
    name: "Template 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus et veritatis voluptatum animi ipsum facilis at asperiores a. Nihil assumenda corporis ipsa debitis tenetur expedita, numquam magnam? Aliquid, modi obcaecati!",
    updatedAt: "2023-01-02"
  },
  {
    id: 3,
    name: "Template 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus et veritatis voluptatum animi ipsum facilis at asperiores a. Nihil assumenda corporis ipsa debitis tenetur expedita, numquam magnam? Aliquid, modi obcaecati!",
    updatedAt: "2023-01-03"
  },
  {
    id: 4,
    name: "Template 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus et veritatis voluptatum animi ipsum facilis at asperiores a. Nihil assumenda corporis ipsa debitis tenetur expedita, numquam magnam? Aliquid, modi obcaecati!",
    updatedAt: "2023-01-04"
  },
]
function WeightTemplate() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({
    pageSize: 2,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
  })
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>("");
  const handleOnSearch = async(value:string) => {
    setKeyword(value)
    const params = {
      keyword: value,
      page: 1
    }
    setPagination({
      ...pagination,
      current:1
    })
    updateUrlQuery(router,params)
  }

  const fetchWeightTemplate = async () => {
    setLoading(true)
    try {
      setTimeout(() => {
        setData(fakeData)
        setLoading(false)
      }, 1000);
    } catch (error) {
      console.log(">>> Get Weight Template Error", error)
      setLoading(false)
    }
  }

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const {current} = pagination
    changeNextPageUrl(router,current)
    setPagination(pagination)
  }

  const columns: any = useMemo(
    () => [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: 'Template Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: any) => <div>{text}</div>,
        width: 500,
      },
      {
        title: 'Last Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text: any) => <div>{moment().format('DD-MM-YYYY')}</div>,
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Space size="middle">
                <EditOutlined className='text-lg cursor-pointer' onClick={() => router.push(`${BREADCRUMB_WEIGHT_TEMPLATE.url}/edit/${record.id}`)}/>
                <DeleteOutlined className='text-lg cursor-pointer'/>
              </Space>
            </div>
          )
        },
      },
    ], [data])
  const mapFirstQuery = () => {
    const query = qs.parse(window.location.search);
    const {page, keyword} = query
    if (page) {
      setPagination({
        ...pagination,
        current: +page
      })
    }
    if (keyword) {
      setKeyword(keyword.toString())
    }
  }
  useEffect(() => {
    mapFirstQuery()
    fetchWeightTemplate();
    dispatch(setBreadcrumb({data: [BREADCRUMB_WEIGHT_TEMPLATE]}))
  },[])
  return (
    <div>
      <Space className='w-full flex flex-row justify-between'>
        <SearchInput keyword={keyword} name="keyword" placeholder="Search by Template" onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleOnSearch}/>
        <ActionButton icon={<PlusOutlined />} label={'Add Weight Template'} onClick={() => router.push(`${BREADCRUMB_WEIGHT_TEMPLATE.url}/add`)}/>
      </Space>
      <div>
        <TableGeneral loading={loading} columns={columns} data={data} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>
    </div>
  );
}

WeightTemplate.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};

export default WeightTemplate;