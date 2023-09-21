import React, {useEffect, useMemo, useState} from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

import { Input, Space, Tag } from 'antd';
import { Select } from 'antd';
import TableGeneral from '@/components/table';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';
import { getCampaignBudgets } from '@/services/campaign-budgets-services';

const { Search } = Input;

export interface ICampaignBudgetsProps {
}

const STATUSES = [
  {
    id: 1,
    value: "all",
    label: "All"
  },
  {
    id: 2,
    value: "running",
    label: "Running"
  },
  {
    id: 3,
    value: "upcomming",
    label: "Upcomming"
  }, 
]

const BULK_ACTION = [
  {
    id: 1,
    value: "update_status",
    label: "Update Status"
  },
  {
    id: 2,
    value: "schedule_status",
    label: "Schedule Status"
  },
  {
    id: 3,
    value: "schedule_budget_once",
    label: "Schedule Budget Once"
  }, 
  {
    id: 4,
    value: "schedule_budget_with_weight",
    label: "Schedule Budget With Weight"
  }, 
  {
    id: 5,
    value: "export_schedule",
    label: "Export Schedule"
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

export default function CampaignBudgets (props: ICampaignBudgetsProps) {
  const [statuses, setStatuses] = useState<any[]>(STATUSES)
  const [bulkAction, setBulkAction] = useState<any[]>(BULK_ACTION)
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>();
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [page, setPage] = useState({
    page: 0,
    pageSize: 5,
    total: 0
});

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    getCampaignBudgetsList(1)
  }

  const getCampaignBudgetsList = async (params: any) => {
    try {
      const result = await getCampaignBudgets(params)
      setCampaignBudgets(result && result.data? result.data : [])
      setPage({
        ...page,
        page: result.page,
        pageSize: result.per_page,
        total: result.total
      })
    } catch (error) {
      console.log(">>> error", error)
    }
  }
  

  const { setBreadcrumb } = useBreadcrumb();
  const handleSearch = (value: any) => {

  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: any = useMemo(
    () => [
      {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
        render: (text: any) => <a>{text}</a>,
        onFilter: (value: string, record: any) => record.first_name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.first_name.localeCompare(b.first_name),
      },
      {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
        render: (text: any) => <a>{text}</a>,
        onFilter: (value: string, record: any) => record.last_name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.last_name.localeCompare(b.last_name),
        defaultSortOrder: 'descend',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => {
          return (
            <Space size="middle">
              <a>Invite {record.first_name}</a>
              <a>Delete</a>
            </Space>
          )
        },
      },
    ], [campaignBudgets])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangePage = (page: any) => {

  }
  useEffect(() => {
    setBreadcrumb([BREADCRUMB_CAMPAIGN_BUDGET])
  },[])

  return (
    <div className='text-black'>
      <div className='grid grid-cols-4 items-center'>
        <Space direction="vertical">
          <Search placeholder="input search text" onSearch={handleSearch} style={{ width: 200 }} />
        </Space>
        <div className='flex items-center'>
          <p className='mr-2'>Status</p>
          <Select
            showSearch
            placeholder="Select status"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={statuses}
          />
        </div>
        <div className='flex items-center'>
          <p className='mr-2'>Bulk Action</p>
          <Select
            showSearch
            placeholder="Select action"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={bulkAction}
          />
        </div>
        <div className='flex items-center'>
          <p className='mr-2'>Partner Account</p>
          <Select
            showSearch
            placeholder="Select partner"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={partnerAccount}
          />
        </div>
      </div>
      <div>
        <TableGeneral columns={columns} data={campaignBudgets} rowSelection={rowSelection} pagination={{...page, onChange:(page: any) => getCampaignBudgetsList(page)}}/>
      </div>
    </div>
  );
}

CampaignBudgets.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);