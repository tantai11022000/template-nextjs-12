import React, {useEffect, useMemo, useState} from 'react';
import qs from 'query-string';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

import { Input, Space, Switch, Tag } from 'antd';
import { Select } from 'antd';
import TableGeneral from '@/components/table';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET, BREADCRUMB_TARGETING_BIDDING } from '@/components/breadcrumb-context/constant';
import { getCampaignBudgets } from '@/services/campaign-budgets-services';
import Link from 'next/link';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';

const { Search } = Input;

export interface ITargetingBiddingProps {
}

const STATUSES = [
  {
    id: 1,
    value: "all",
    label: "All"
  },
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
    url: '/amazon/targeting-bidding/update-schedule'
  },
  {
    id: 3,
    value: "download",
    label: "Download",
    url: ''
  }, 
]

const PARTNER_ACCOUNT = [
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'tom',
    label: 'Tom',
  },
]

const CAMPAIGNS = [
  {
    value: 'campaignA',
    label: 'Campaign A',
  },
  {
    value: 'campaignB',
    label: 'Campaign B',
  },
  {
    value: 'campaignC',
    label: 'Campaign C',
  },
]

const DATA = [
  {
    id: 1,
    campaign: "Campaign A",
    status: "active",
    currentBidding: 10000,
    target: "Target A",
    portfolio: 'Portfolio 1'
  },
  {
    id: 2,
    campaign: "Campaign B",
    status: "inactive",
    currentBidding: 20000,
    target: "Target B",
    portfolio: 'Portfolio 2'
  },
  {
    id: 3,
    campaign: "Campaign C",
    status: "inactive",
    currentBidding: 30000,
    target: "Target B",
    portfolio: 'Portfolio 2'
  },
  {
    id: 4,
    campaign: "Campaign D",
    status: "active",
    currentBidding: 30000,
    target: "Target A",
    portfolio: 'Portfolio 2'
  },
]

export default function TargetingBidding (props: ITargetingBiddingProps) {
  const router = useRouter()
  const { setBreadcrumb } = useBreadcrumb();

  const [openModalUpdateStatus, setOpenModalUpdateStatus] = useState<boolean>(false);
  const [statuses, setStatuses] = useState<any[]>(STATUSES)
  const [bulkAction, setBulkAction] = useState<any[]>(BULK_ACTION)
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)
  const [campaigns, setCampaigns] = useState<any[]>(CAMPAIGNS)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>();
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>(DATA)
  const [keyword, setKeyword] = useState<string>("");

  const [isEditBudget, setIsEditBudget] = useState<boolean>(false);

  const [pagination, setPagination] = useState<any>({
    pageSize: 2,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  useEffect(() => {
    setBreadcrumb([BREADCRUMB_TARGETING_BIDDING])
    mapFirstQuery()
    init();
  }, [])

  const init = () => {
    getCampaignBudgetsList(1)
  }

  const getCampaignBudgetsList = async (params: any) => {
    try {
      const result = await getCampaignBudgets(params)
      // setCampaignBudgets(result && result.data? result.data : [])
    } catch (error) {
      console.log(">>> error", error)
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

  const onChange = (value: string, url: string) => {
    console.log(`selected ${value}`);
    if (value == "update_status") {
      setOpenModalUpdateStatus(!openModalUpdateStatus)
    } else if (value == "schedule_status") {
      router.push(`/amazon/campaign-budgets/update-status`)
    } else if (value == "schedule_budget_once") {
      router.push(`/amazon/campaign-budgets/update-budget`)
    }
  };
  
  const onSearchInFilter = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
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

  const columns: any = useMemo(
    () => [
      {
        title: 'Target',
        dataIndex: 'target',
        key: 'target',
        render: (text: any) => <p>{text}</p>,
      },
      {
        title: 'Name',
        dataIndex: 'campaign',
        key: 'campaign',
        render: (_: any, record: any) => {
          const {id, campaign} = record

          return (
            <>
              <Link href={`/amazon/campaign-budgets/${id}`}>{campaign}</Link>
            </>
          )
        },

        onFilter: (value: string, record: any) => record.campaign.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.campaign.localeCompare(b.campaign),
      },
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Tag>{record.status}</Tag>
            </div>
          );
        },
        sorter: (a: any, b: any) => a.status - b.status,
      },
      {
        title: 'Current Bidding',
        dataIndex: 'currentBidding',
        key: 'currentBidding',
        render: (text: any) => {
          const handleChangeBudget = () => {
            if (isEditBudget) setIsEditBudget(false)
            else setIsEditBudget(true)
          }
          return (
            <div className='flex'>
              {!isEditBudget 
                ? <span>JPY {text}</span>
                : <Input type='number' min={0}/>}
              <a className='ml-2' onClick={handleChangeBudget}>{isEditBudget ? 'Save' : 'Edit'}</a>
            </div>
          )
        }
      },
      {
        title: <div className='text-center'>Action</div>,
        key: 'action',
        render: (_: any, record: any) => {
          const {id} = record
          return (
            <Space size="middle" className='flex justify-center'>
              <a>Edit</a>
              <Link href={`/amazon/targeting-bidding/${id}`}>Log</Link>
            </Space>
          )
        },
      },
    ], [campaignBudgets, isEditBudget]
  )

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log(">>> newSelectedRowKeys", newSelectedRowKeys.length)
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleOk = () => {
    setOpenModalUpdateStatus(false);
  };

  const handleCancel = () => {
    setOpenModalUpdateStatus(false);
  };

  return (
    <div className='text-black'>
      <div className='grid grid-cols-4 items-center'>
        <Space direction="vertical">
          <Search value={keyword} name="keyword" placeholder="Search by name" onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch} />
        </Space>
        <div className='flex items-center'>
          <p className='mr-2'>Status</p>
          <Select
            style={{ width: 120 }}
            defaultValue="all"
            showSearch
            placeholder="Select status"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearchInFilter}
            filterOption={filterOption}
            options={statuses}
          />
        </div>
        <div className='flex items-center'>
          <p className='mr-2 text-black'>Campaign</p>
          <Select
            showSearch
            placeholder="Select Campaign"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearchInFilter}
            filterOption={filterOption}
            options={campaigns}
          />
        </div>
        <div className='flex items-center'>
          <p className='mr-2 text-black'>Bulk Action</p>
          <Select
            style={{ width: 200 }}
            showSearch
            placeholder="Select action"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearchInFilter}
            filterOption={filterOption}
            options={bulkAction}
          />
        </div>
      </div>
      <div>
        <TableGeneral columns={columns} data={campaignBudgets} rowSelection={rowSelection} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>
      {openModalUpdateStatus && (
        <Modal title="Update Target Status" open={openModalUpdateStatus} onOk={handleOk} onCancel={handleCancel}>
          <p>Update {selectedRowKeys && selectedRowKeys.length ? selectedRowKeys.length : 0} selected target(s) to status: <Switch defaultChecked /></p>
        </Modal>
      )}
    </div>
  );
}

TargetingBidding.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);