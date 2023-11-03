import React, { useEffect, useMemo, useState } from 'react';
import qs from 'query-string';
import RootLayout from '../../components/layout';
import DashboardLayout from '../../components/nested-layout/DashboardLayout';
import Link from 'next/link';
import { Space, Input, Layout, Button } from 'antd';
import TableGeneral from '@/components/table';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';
import { useRouter } from 'next/router';
import { BREADCRUMB_WEIGHT_TEMPLATE } from '@/components/breadcrumb-context/constant';
import { useAppDispatch } from '@/store/hook';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';

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
        render: (text: any) => <a>{text}</a>,
      },
      {
        title: 'Template Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <a>{text}</a>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: any) => <a>{text}</a>,
        width: 500,
      },
      {
        title: 'Last Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text: any) => <a>{moment().format('DD-MM-YYYY')}</a>,
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_: any, record: any) => {
          return (
            <Space size="middle">
              <DeleteOutlined className='text-lg cursor-pointer'/>
              <EditOutlined className='text-lg cursor-pointer' onClick={() => router.push(`${BREADCRUMB_WEIGHT_TEMPLATE.url}/edit/${record.id}`)}/>
            </Space>
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
    <>
      <div className='flex justify-between'>
        <Space>
          <Input.Search value={keyword} name="keyword" placeholder="Search by name" 
          onChange={(e:any) => setKeyword(e.target.value)} onSearch={handleOnSearch} className='w-96'/>
        </Space>
        <Space>
          <Link href={`${BREADCRUMB_WEIGHT_TEMPLATE.url}/add`}>
            <Button className='bg-primary text-white w-28 cursor-pointer'>Add</Button>
          </Link>
        </Space>
      </div>
      <TableGeneral loading={loading} columns={columns} data={data} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>        
    </>
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