import React, {useEffect, useMemo, useState} from 'react';
import { Dropdown, Input, Space, Tag } from 'antd';
import TableGeneral from '@/components/table';
import { useRouter } from 'next/router';
import { changeNextPageUrl, notificationSimple, updateUrlQuery } from '@/utils/CommonUtils';
import { deleteAccountById, getAllPartnerAccounts, updateAccountStatus } from '@/services/accounts-service';
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
import { setAccountList, setCurrentAccount } from '@/store/account/accountSlice';
import { getItem, storeItem } from '@/utils/StorageUtils';
import { CURRENT_ACCOUNT } from '@/utils/StorageKeys';
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
  const dispatch = useAppDispatch()
  const currentAccount = getItem(CURRENT_ACCOUNT)
  const [loading, setLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>("")
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })

  useEffect(() => {
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.accounts') , url: '/accounts'}]}))
  }, [])

  useEffect(() => {
    init()
  }, [pagination.pageSize, pagination.current])

  const init = () => {
    getAllAccounts(keyword)
  }
  
  const getAllAccounts = async (keywords: string) => {
    setLoading(true)
    try {
      const {pageSize, current} = pagination
      var params = {
        page: current,
        pageSize,
        keywords
      }

      const result = await getAllPartnerAccounts(params)
      if (result && result.data) {
        setAccounts(result.data)

        const activeAccounts = result.data.filter((account: any) => account.status == 1)
        dispatch(setAccountList({data: activeAccounts}))

        const isCurrentAccount = result.data.find((account: any) => account.id == currentAccount)
        dispatch(setCurrentAccount({data: isCurrentAccount.status == 2 ? activeAccounts[0].id : currentAccount}))
        storeItem(CURRENT_ACCOUNT, isCurrentAccount.status == 2 ? activeAccounts[0].id : currentAccount)
        setPagination({...pagination, total: result.pagination.total})
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> Get All Accounts Error", error)
      setLoading(false)
    }
  }
 
  const handleSearch = async(value: string) => {
    setKeyword(value)
    const params = {
      keyword: value,
      page: 1
    }
    setPagination({
      ...pagination,
      current: 1
    })
    // updateUrlQuery(router, params)
    getAllAccounts(value)
  }

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const handleUpdateAccountStatus = async (id: string, status: any) => {
    try {
      const body = { status }
      const result = await updateAccountStatus(id, body)
      if (result && result.message == "OK") {
        await getAllAccounts(keyword);
        notificationSimple(renderTranslateToastifyText(t('commons.status')), NOTIFICATION_SUCCESS)
      }
    } catch (error: any) {
      console.log(">>> Update Account Status Error", error)
      notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
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
        // sorter: (a: any, b: any) => a.name.localeCompare(b.name),
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
        // sorter: (a: any, b: any) => a.state - b.state,
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        render: (_: any, record: any) => {
          const id = record.id

          const onDeleteAccount = async (id: any) => {
            try {
              const params = {
                partnerAccountId: currentAccount,
                scheduleId: id
              }
              const result = await deleteAccountById(id)
              if (result && result.message == "OK") {
                notificationSimple(renderTranslateToastifyText(t('commons.schedule')), NOTIFICATION_SUCCESS)
                getAllAccounts(keyword)
              }
            } catch (error) {
              
            }
          }

          return (
            <div className='flex justify-center'>
              <Space size="middle">
                <EditOutlined className='text-lg cursor-pointer' onClick={() => router.push(`${BREADCRUMB_ACCOUNT.url}/edit/${id}`)}/>
                <DeleteOutlined className='text-lg cursor-pointer' onClick={() => onDeleteAccount(id)}/>
              </Space>
            </div>
          )
        },
      },
    ], [accounts]
  )

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const { current } = pagination
    // changeNextPageUrl(router, current)
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

  const renderTranslateToastifyText = (text: any) => {
    let translate = t("toastify.success.updated_text")
    return translate.replace("{text}", text);
  }

  return (
    <div>
      <Space className='w-full flex flex-row justify-between'>
        <SearchInput keyword={keyword} name="keyword" placeholder={renderTranslateSearchText(t('account_page.account'))} onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch}/>
        <ActionButton className={'action-button'} iconOnLeft={<PlusOutlined />} label={renderTranslateActionButton(t('account_page.account'))} onClick={() => router.push(`${BREADCRUMB_ACCOUNT.url}/add`)}/>
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
