import React, {useEffect, useMemo, useState} from 'react';
import { Dropdown, Input, Space, Tag } from 'antd';
import TableGeneral from '@/components/table';
import { useRouter } from 'next/router';
import { changeNextPageUrl, notificationSimple, updateUrlQuery } from '@/utils/CommonUtils';
import { getAllPartnerAccounts, updateAccountStatus } from '@/services/accounts-service';
import { BREADCRUMB_ACCOUNT } from '@/Constant/index';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import RootLayout from '@/components/layout';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { useAppDispatch } from '@/store/hook';
import { DeleteOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import SearchInput from '@/components/commons/textInputs/SearchInput';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { PlusOutlined } from '@ant-design/icons';
import { USER_STATUS } from '@/enums/status';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';
import { setAccountList } from '@/store/account/accountSlice';
import Link from 'next/link'

export async function getStaticProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}
export interface IAccountsProps {
}

export default function Accounts (props: IAccountsProps) {
  const  { t } = useTranslation()
  const router = useRouter()
  console.log(">>> Accounts router", router)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>("")
  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    total: 0,
  })

  useEffect(() => {
    dispatch(setBreadcrumb({data: [BREADCRUMB_ACCOUNT]}))
  }, [])

  useEffect(() => {
    init()
  }, [pagination.pageSize, pagination.current])

  const init = () => {
    getAllAccounts()
  }
  
  const getAllAccounts = async () => {
    setLoading(true)
    try {
      const {pageSize, current, total} = pagination
      var params = {
        page: current,
        pageSize,
        total
      }

      const result = await getAllPartnerAccounts(params)
      if (result && result.data) {
        setAccounts(result.data)
        dispatch(setAccountList({data: result.data}))
        setPagination({...pagination, total: result.pagination.total})
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> Get All Accounts Error", error)
      setLoading(false)
    }
  }
 
  const handleSearch= async(value:string) => {
    setKeyword(value)
    const params = {
      keyword: value,
      page: 1
    }
    setPagination({
      ...pagination,
      current: 1
    })
    updateUrlQuery(router, params)
  }

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const handleUpdateAccountStatus = async (id: string, status: any) => {
    try {
      const body = { status }
      const result = await updateAccountStatus(id, body)
      if (result && result.message == "OK") {
        await getAllAccounts();
        notificationSimple("Update Status Success", NOTIFICATION_SUCCESS)
      }
    } catch (error) {
      console.log(">>> Update Account Status Error", error)
      notificationSimple("Update Status Fail", NOTIFICATION_ERROR)
    }
  };

  const columns: any = useMemo(
    () => [
      {
        title: <div className='text-center'>No.</div>,
        dataIndex: 'id',
        key: 'id',
        render: (text: any) => <p>{text}</p>,
      },
      {
        title: <div className='text-center'>{t('commons.name')}</div>,
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: <div className='text-center'>{t('commons.status')}</div>,
        dataIndex: 'state',
        key: 'state',
        render: (_: any, record: any) => {
          const statusData = record.status
          const id = record.id
          const dropdownMenuItems = [
            {
              key: '1',
              label: statusData === USER_STATUS.ACTIVE ? 'INACTIVE' : 'ACTIVE',
              onClick: () => handleUpdateAccountStatus(id, statusData === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE),
            },
          ];
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (statusData == USER_STATUS.ACTIVE) {
              status = t('commons.status_enum.active')
              type = 'success'
            } else if (statusData == USER_STATUS.INACTIVE) {
              status = t('commons.status_enum.inactive')
              type = 'error'
            }
            return <Tag className='text-center uppercase' color={type}>{status} <DownOutlined/></Tag>
          }
          return (
            <div className='flex justify-center'>
              <Dropdown menu={{ items: dropdownMenuItems }}>
                <a className='tag px-2 font-semibold'>{renderStatus()}</a>
              </Dropdown>
            </div>
          );
        },
        sorter: (a: any, b: any) => a.state - b.state,
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Space size="middle">
                {/* <EditOutlined className='text-lg cursor-pointer is-link' onClick={() => router.push(`/static-route/edit/${record.id}`)}/> */}
                <EditOutlined className='text-lg cursor-pointer is-link' onClick={() => router.replace({pathname: '/static-route/[slug]/[id]', query: {...router.query, slug: 'edit', id: record.id}})}/>
                <DeleteOutlined className='text-lg cursor-pointer'/>
              </Space>
            </div>
          )
        },
      },
    ], [accounts]
  )

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  const renderTranslateSearchText = (text: any) => {
    let translate = t("commons.search_by_text");
    return translate.replace("{text}", text);
  }

  const renderTranslateActionButton = (text: any) => {
    let translate = t("commons.action_type.add_text");
    return translate.replace("{text}", text);
  }

  return (
    <div>
      <Space className='w-full flex flex-row justify-between'>
        <SearchInput keyword={keyword} name="keyword" placeholder={"Search by Static Name"} onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch}/>
        {/* <ActionButton className={'action-button'} iconOnLeft={<PlusOutlined />} label={"Static"} onClick={() => router.push({pathname: `/static-route/[slug]`, query: {slug: 'add'}})}/> */}
        <Link href={{
          pathname: '/static-route/[slug]',
          query: { slug: 'add' },
        }}>
          <ActionButton className={'action-button'} iconOnLeft={<PlusOutlined />} label={"Static"}/>
        </Link>
      </Space>
      <div>
        <TableGeneral loading={loading} columns={columns} data={accounts ? accounts : []} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>
    </div>
  );
}

Accounts.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};
