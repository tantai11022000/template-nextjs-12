import React, {useEffect, useMemo, useState} from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

import { Input, Space, Switch, Tag } from 'antd';
import { Select } from 'antd';
import TableGeneral from '@/components/table';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';
import { getCampaignBudgets } from '@/services/campaign-budgets-services';
import Link from 'next/link';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';

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

const DATA = [
  {
    id: 1,
    campaign: "Campaign A",
    status: "Running",
    currentBudget: 10000,
    imp: 1000,
    click: 100,
    sale: 2000,
    roas: 1.1,
  },
  {
    id: 2,
    campaign: "Campaign B",
    status: "Pending",
    currentBudget: 20000,
    imp: 2000,
    click: 200,
    sale: 3000,
    roas: 1.1,
  },
]

export default function CampaignBudgets (props: ICampaignBudgetsProps) {
  const router = useRouter()
  const [openModalUpdateStatus, setOpenModalUpdateStatus] = useState<boolean>(false);
  const [statuses, setStatuses] = useState<any[]>(STATUSES)
  const [bulkAction, setBulkAction] = useState<any[]>(BULK_ACTION)
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>();
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>(DATA)
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
      // setCampaignBudgets(result && result.data? result.data : [])
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
    if (value == "update_status") {
      setOpenModalUpdateStatus(!openModalUpdateStatus)
    } else if (value == "schedule_status") {
      router.push(`/amazon/campaign-budgets/update-status`)
    } else if (value == "schedule_budget_once") {
      router.push(`/amazon/campaign-budgets/update-budget`)
    }
  };
  
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columns: any = useMemo(
    () => [
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
        title: 'Current Budget',
        dataIndex: 'currentBudget',
        key: 'currentBudget',
        render: (text: any) => <p className='text-end'>JPY {text}</p>,

        onFilter: (value: string, record: any) => record.last_name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.currentBudget - b.currentBudget
      },
      {
        title: 'IMP',
        dataIndex: 'imp',
        key: 'imp',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: 'Click',
        dataIndex: 'click',
        key: 'click',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.click - b.click
      },
      {
        title: 'Sale',
        dataIndex: 'sale',
        key: 'sale',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.sale - b.sale
      },
      {
        title: 'ROAS',
        dataIndex: 'roas',
        key: 'roas',
        render: (text: any) => <p className='text-end'>{text}</p>,
        
        sorter: (a: any, b: any) => a.roas - b.roas
      },
      {
        title: <div className='text-center'>Action</div>,
        key: 'action',
        render: (_: any, record: any) => {
          return (
            <Space size="middle" className='flex justify-center'>
              <a>Edit</a>
              <a>Delete</a>
            </Space>
          )
        },
      },
    ], [campaignBudgets]
  )

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log(">>> newSelectedRowKeys", newSelectedRowKeys.length)
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

  const showModal = () => {
    setOpenModalUpdateStatus(true);
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
      {openModalUpdateStatus && (
        <Modal title="Update Campaign Status" open={openModalUpdateStatus} onOk={handleOk} onCancel={handleCancel}>
          <p>Update {selectedRowKeys && selectedRowKeys.length ? selectedRowKeys.length : 0} selected campaign(s) to status: <Switch defaultChecked /></p>
        </Modal>
      )}
    </div>
  );
}

CampaignBudgets.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);