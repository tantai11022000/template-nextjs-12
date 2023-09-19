import React, {useState} from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

import { Input, Space } from 'antd';
import { Select } from 'antd';
import TableGeneral from '@/components/table';

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

  const handleSearch = (value: any) => {

  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
        <TableGeneral/>
      </div>
    </div>
  );
}

CampaignBudgets.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);