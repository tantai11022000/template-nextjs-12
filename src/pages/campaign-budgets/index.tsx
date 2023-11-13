import React, {useEffect, useMemo, useState} from 'react';
import qs from 'query-string';

import { Dropdown, Input, Space, Switch, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { Select } from 'antd';
import TableGeneral from '@/components/table';
import { getCampaignBudgets } from '@/services/campaign-budgets-services';
import Link from 'next/link';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';
import store from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { SaveOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';

import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import SearchInput from '@/components/commons/textInputs/SearchInput';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


export async function getStaticProps(context: any) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}

export interface ICampaignBudgetsProps {
}

const STATUSES = [
  {
    id: 2,
    value: "deliver",
    label: "In Deliver"
  },
  {
    id: 3,
    value: "stopped",
    label: "Stopped"
  },
  {
    id: 4,
    value: "paused",
    label: "Paused"
  }, 
  {
    id: 5,
    value: "out_budget",
    label: "Out Budget"
  }, 
]

const BULK_ACTION = [
  {
    id: 1,
    value: "update_status",
    label: "Update Status",
    url: ''
  },
  {
    id: 2,
    value: "schedule_status",
    label: "Schedule Status",
    url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`
  },
  {
    id: 3,
    value: "schedule_budget_once",
    label: "Schedule Budget Once",
    url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`
  }, 
  {
    id: 4,
    value: "schedule_budget_with_weight",
    label: "Schedule Budget With Weight",
    url: ''
  }, 
  {
    id: 5,
    value: "export_schedule",
    label: "Export Schedule",
    url: ''
  }, 
]

export default function CampaignBudgets (props: ICampaignBudgetsProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  console.log(">>> router", router)
  const currentAccount = useAppSelector(getCurrentAccount)
  const dispatch = useAppDispatch()

  const [openModalUpdateStatus, setOpenModalUpdateStatus] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<any>("Select Action");
  const [statuses, setStatuses] = useState<any[]>(STATUSES)
  const [bulkAction, setBulkAction] = useState<any[]>(BULK_ACTION)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>();
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isEditingList, setIsEditingList] = useState(
    campaignBudgets.map(() => false)
  );

  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    total: 0,
  })

  useEffect(() => {
    mapFirstQuery()
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET]}))
  }, [])

  useEffect(() => {
    if (currentAccount) getCampaignBudgetsList(currentAccount)
  }, [currentAccount, pagination.pageSize, pagination.current])

  const getCampaignBudgetsList = async (partnerAccountId: any) => {
    setLoading(true)
    try {
      const {pageSize, current, total} = pagination
      var params = {
        page: current,
        pageSize,
        total
      }

      const result = await getCampaignBudgets(partnerAccountId, params)
      if (result && result.data) {
        setCampaignBudgets(result.data)
        setPagination({...pagination, total: result.pagination.total})
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> error", error)
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

  const onChange = (value: string) => {
    
    console.log(`selected ${value}`);
    if (value == "update_status") {
      setOpenModalUpdateStatus(true)
    } else if (value == "schedule_status") {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`)
    } else if (value == "schedule_budget_once") {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`)
    } else if (value == "schedule_budget_with_weight") {
      router.push({
        pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
        query: {isWeight: true}
      })
    }
    setSelectedStatus("Select Action")
  };
  
  const onSearchInFilter = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleOnChangeTable = (pagination:any, filters: any, sorter: any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setPagination(pagination)
  }

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

  const handleToggleEdit = (index: any) => {
    const updatedIsEditingList = [...isEditingList];
    updatedIsEditingList[index] = !updatedIsEditingList[index];
    setIsEditingList(updatedIsEditingList);
  };

  const changeLanguage = (newLanguage: any) => {
    console.log('Changing language to:', newLanguage);
    const { pathname, query } = router;
    router.push({ pathname, query }, undefined, { locale: newLanguage });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log(">>> newSelectedRowKeys", newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      id: record.campaignId,
    }),
    onChange: onSelectChange,
  };

  const handleOk = () => {
    setOpenModalUpdateStatus(false);
    setSelectedStatus("Select Action")
  };

  const handleCancel = () => {
    setOpenModalUpdateStatus(false);
    setSelectedStatus("Select Action")
  };

  const columns: any = useMemo(
    () => [
      {
        title: <div className='text-center'>Campaign Name</div>,
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: <div className='text-center'>Portfolio</div>,
        dataIndex: 'deliveryProfile',
        key: 'deliveryProfile',
        render: (text: any) => <p className='text-center'>{text}</p>,
      },
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'state',
        key: 'state',
        render: (_: any, record: any) => {
          const items = [
            { key: '1', label: 'Action 1' },
            { key: '2', label: 'Action 2' },
          ];
          return (
            <div className='tag-container'>
              <Dropdown menu={{ items }}>
                <a className='tag px-2 font-semibold'>{record.state} <DownOutlined/></a>
              </Dropdown>
            </div>
          );
        },
        sorter: (a: any, b: any) => a.state - b.state,
      },
      {
        title: <div className='text-center'>Current Budget</div>,
        dataIndex: 'budget',
        key: 'budget',
        render: (text: any, record: any, index: number) => {
          const isEditing = isEditingList[index];

          const handleBudgetChange = (e: any, index: any) => {
            const updatedBudgets = [...campaignBudgets];
            updatedBudgets[index].budget = e.target.value;
            setCampaignBudgets(updatedBudgets);
          };

          return (
            <div className='flex items-center justify-between'>
              {!isEditing 
                ? <div className='flex items-center'>￥ <span>{text}</span></div>
                : (
                  <div className='current-budget'>
                    <Input type='number' min={0} value={text} onChange={(e) => handleBudgetChange(e, index)} />
                  </div>
              )}
              <div className='flex ml-2' onClick={() => handleToggleEdit(index)}>
                {isEditing ? <SaveOutlined className='text-lg cursor-pointer' /> : <EditOutlined className='text-lg cursor-pointer' />}
              </div>
            </div>
          );
        }
      },
      {
        title: <div className='text-center'>IMP</div>,
        dataIndex: 'imp',
        key: 'imp',
        render: (text: any) => <p className='text-end'>{text || '-'}</p>,

        sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: <div className='text-center'>Click</div>,
        dataIndex: 'click',
        key: 'click',
        render: (text: any) => <p className='text-end'>{text || '-'}</p>,

        sorter: (a: any, b: any) => a.click - b.click
      },
      {
        title: <div className='text-center'>Sale</div>,
        dataIndex: 'sale',
        key: 'sale',
        render: (text: any) => <p className='text-end'>{text || '-'}</p>,

        sorter: (a: any, b: any) => a.sale - b.sale
      },
      {
        title: <div className='text-center'>ROAS</div>,
        dataIndex: 'roas',
        key: 'roas',
        render: (text: any) => <p className='text-end'>{text || '-'}</p>,
        
        sorter: (a: any, b: any) => a.roas - b.roas
      },
      {
        title: <div className='text-center'>Action</div>,
        key: 'action',
        render: (_: any, record: any) => {
          const {campaignId, name} = record
          return (
            <div className='flex justify-center'>
              <FileTextOutlined className='text-lg cursor-pointer is-link' onClick={() =>router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaignId}`)}/>
            </div>
          )
        },
      },
    ], [campaignBudgets, handleToggleEdit, isEditingList]
  )

 

  return (
    <div>
      <h1>{t("greeting")}</h1>
      <div className='button-container'>
      <button className='finish-button mr-4' onClick={() => changeLanguage('en')}>English</button>
      <button className='finish-button' onClick={() => changeLanguage('jp')}>Japanese</button>
      </div>
      <div className='flex items-center justify-between'>
          <SearchInput keyword={keyword} name={"keyword"} placeholder={t("greeting")} onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch}/>
        <div className='flex items-center gap-6'>
          <SelectFilter label={"Status"} placeholder={"Select Status"} onChange={onChange} options={statuses} />
          <SelectFilter label={"Bulk Action"} placeholder={"Select Action"} onChange={onChange} options={bulkAction} value={selectedStatus}/>
        </div>
      </div>
      <div>
        <TableGeneral loading={loading} columns={columns} data={campaignBudgets ? campaignBudgets : []} rowSelection={rowSelection} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>
      {openModalUpdateStatus && (
        <Modal
          title="Update Campaign Status"
          open={openModalUpdateStatus}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <p>Update {selectedRowKeys && selectedRowKeys.length ? selectedRowKeys.length : 0} selected campaign(s) to status: <Switch defaultChecked /></p>
          <Space size="middle" className='w-full flex items-center justify-end mt-8'>
            <ActionButton className="cancel-button" label="Cancel" onClick={handleCancel} />
            <ActionButton className="finish-button" label="Update" />
          </Space>
        </Modal>
      )}
    </div>
  );
}


CampaignBudgets.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};
