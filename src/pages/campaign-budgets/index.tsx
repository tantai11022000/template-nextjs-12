import React, {useEffect, useMemo, useState} from 'react';
import qs from 'query-string';
import { Dropdown, Input, Space, Switch, Tag, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TableGeneral from '@/components/table';
import { changeBudgetCampaign, getCampaignBudgets } from '@/services/campaign-budgets-services';
import { Modal } from 'antd';
import { useRouter } from 'next/router';
import { changeNextPageUrl, notificationSimple, updateUrlQuery } from '@/utils/CommonUtils';
import store from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getCurrentAccount, getIsSyncData, setSyncData } from '@/store/account/accountSlice';
import { SaveOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';

import { CAMPAIGN_STATUS } from '@/enums/status';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import SearchInput from '@/components/commons/textInputs/SearchInput';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';

export async function getStaticProps(context: any) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

export interface ICampaignBudgetsProps {
}

const STATUSES = [
  {
    id: 1,
    value: 1,
    label: "Enable"
  },
  {
    id: 2,
    value: 2,
    label: "Paused"
  },
  {
    id: 3,
    value: 3,
    label: "Archived"
  }, 
  {
    id: 4,
    value: 4,
    label: "Other"
  }, 
]

const BULK_ACTION = [
  {
    id: 1,
    value: 1,
    label: "Update Status",
    url: ''
  },
  {
    id: 2,
    value: 2,
    label: "Update Status Schedule",
    url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`
  },
  {
    id: 3,
    value: 3,
    label: "Update Budget Schedule",
    url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`
  },
  {
    id: 4,
    value: 4,
    label: "Schedule Budget Once",
    url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`
  }, 
  {
    id: 5,
    value: 5,
    label: "Schedule Budget With Weight",
    url: ''
  }, 
  {
    id: 6,
    value: 6,
    label: "Export Schedule",
    url: ''
  }, 
]

export default function CampaignBudgets (props: ICampaignBudgetsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const currentAccount = useAppSelector(getCurrentAccount)
  const isSync = useAppSelector(getIsSyncData)
  const dispatch = useAppDispatch()

  const [openModalUpdateStatus, setOpenModalUpdateStatus] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<any>('');
  const [statuses, setStatuses] = useState<any[]>(STATUSES)
  const [bulkAction, setBulkAction] = useState<any[]>(BULK_ACTION)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>()
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditingList, setIsEditingList] = useState(
    campaignBudgets && campaignBudgets.map(() => false)
  );
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })
  const [changedBudgets, setChangedBudgets] = useState<Array<any>>([]);
  const [status, setStatus] = useState<number | undefined>()
  const [sort, setSort] = useState<any>({
    orderBy: "",
    sortBy: "asc"
});

  useEffect(() => {
    // mapFirstQuery()
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET]}))
  }, [])

  useEffect(() => {
    if (currentAccount) getCampaignBudgetsList(currentAccount, keyword, status, sort)
  }, [currentAccount, pagination.pageSize, pagination.current])

  useEffect(() => {
    if (isSync) { 
      getCampaignBudgetsList(currentAccount, keyword, status, sort)
      dispatch(setSyncData({data: false}))
    }
  }, [isSync])

  useEffect(() => {
    setSelectedAction(renderTranslateFilterText(t('commons.action')))
  }, [t])
  
  const getCampaignBudgetsList = async (partnerAccountId: any, keywords: string, status: number | undefined, sort: any) => {
    setLoading(true)
    try {
      const {pageSize, current} = pagination
      var params = {
        page: current,
        pageSize,
        keywords,
        isGetMetric: true,
        status,
        ...sort
      }

      const result = await getCampaignBudgets(partnerAccountId, params)
      if (result && result.data && result.data.results) {
        setCampaignBudgets(result.data.results)
        setPagination({...pagination, total: result.pagination.total})
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> error", error)
      setLoading(false)
    }
  }
  
  const handleSearch= async(value: string) => {
    setKeyword(value)
    const params = {
      keyword: value,
      page: 1
    }
    setPagination({
      ...pagination,
      current: 1
    })
    getCampaignBudgetsList(currentAccount, value, status, sort)
    // updateUrlQuery(router, params)
  }

  const handleSelectedBulkAction = (values: any) => {
    console.log(">>>> handleSelectedBulkAction value", values);
    const { value } = values
    if (value == 1) {
      setOpenModalUpdateStatus(true)
    } else if (value == 2) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`)
    } else if (value == 3) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`)
    }else if (value == 4) {
      router.push({
        pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
        query: {
          campaignIds: selectedRowKeys
        }
      })
    } else if (value == 5) {
      router.push({
        pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
        query: {
          isWeight: true,
          campaignIds: selectedRowKeys
        }
      })
    }
    setSelectedAction(renderTranslateFilterText(t('commons.action')))
  };

  const handleSelectedStatus = (values: any) => {
    const { value } = values
    setStatus(value)
    getCampaignBudgetsList(currentAccount, keyword, value, sort)
  };
  
  const onSearchInFilter = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleOnChangeTable = (pagination:any, filters: any, sorter: any) => {
    console.log(">>> sorter", sorter)
    const { field, order } = sorter
    let sort: any = {
      orderBy: null,
      sortBy: null
    }
    if (order) {
      sort = {
        orderBy: field,
        sortBy: order == "ascend"  ? "asc" : "desc"
      }
    }
    getCampaignBudgetsList(currentAccount, keyword, status, sort)
    


    const { current } = pagination
    // changeNextPageUrl(router, current)
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

  const handleToggleEdit = (IDList: any, index: any) => {
    const updatedIsEditingList = [...isEditingList];

    if (IDList == undefined) {
      updatedIsEditingList[index] = !updatedIsEditingList[index];
    } else {
      campaignBudgets.forEach((campaign, index) => {
        if (IDList.includes(campaign.id)) {
          updatedIsEditingList[index] = !updatedIsEditingList[index];
        }
      });
    }
    
    setIsEditingList(updatedIsEditingList);
  };

  
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      id: record.id,
    }),
  };

  const handleOk = () => {
    setOpenModalUpdateStatus(false);
    setSelectedAction(renderTranslateFilterText(t('commons.action')))
  };

  const handleCancel = () => {
    setOpenModalUpdateStatus(false);
    setSelectedAction(renderTranslateFilterText(t('commons.action')))
  };

  const columns: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('campaign_budget_page.campaign_name')}</div>,
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: <div className='text-center'>{t('campaign_budget_page.portfolio')}</div>,
        dataIndex: 'portfolio',
        key: 'portfolio',
        render: (_: any, record: any) => {
          const portfolio = record.portfolio;
          return <p className='text-center'>{portfolio && portfolio.name ? portfolio.name : ""}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.status')}</div>,
        dataIndex: 'state',
        key: 'state',
        render: (_: any, record: any) => {
          const items = [
            { key: '1', label: 'Action 1' },
            { key: '2', label: 'Action 2' },
          ];
          const statusData = record.status
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (statusData == CAMPAIGN_STATUS.ENABLE) {
              status = t('commons.status_enum.enable')
              type = 'success'
            } else if (statusData == CAMPAIGN_STATUS.PAUSED) {
              status = t('commons.status_enum.paused')
              type = 'warning'
            } else if (statusData == CAMPAIGN_STATUS.ARCHIVED) {
              status = t('commons.status_enum.archived')
              type = 'processing'
            } else if (statusData == CAMPAIGN_STATUS.OTHER) {
              status = t('commons.status_enum.other')
              type = 'default'
            }
            return <Tag className='text-center uppercase' color={type}>{status} <DownOutlined/></Tag>
          }
          return (
            <div className='flex justify-center'>
              <Dropdown menu={{ items }}>
                <a className='tag px-2 font-semibold'>{renderStatus()}</a>
              </Dropdown>
            </div>
          );
        },
        // sorter: (a: any, b: any) => a.state - b.state,
      },
      {
        title: <div className='text-center'>{t('campaign_budget_page.current_budget')}</div>,
        dataIndex: 'budget',
        key: 'budget',
        render: (text: any, record: any, index: number) => {
          const budget = record.adtranAmazonCampaignBudget.dailyBudget
          const isEditing = isEditingList[index];

          const handleBudgetChange = (event: any, index: any) => {
            const updatedBudgets = [...campaignBudgets];
            const campaignId = updatedBudgets[index].id;
            const newBudgetValue = Math.abs(event.target.value);

            updatedBudgets[index].adtranAmazonCampaignBudget.dailyBudget = newBudgetValue;
            setCampaignBudgets(updatedBudgets);
        
            const existingChangeIndex = changedBudgets.findIndex((item) => item.campaignId === campaignId);
            if (existingChangeIndex !== -1) {
              changedBudgets[existingChangeIndex].value = newBudgetValue;
            } else {
              setChangedBudgets((prevChangedBudgets) => [
                ...prevChangedBudgets,
                { campaignId: campaignId, value: newBudgetValue },
              ]);
            }
          };
                
          const saveChangedBudgets = async () => {
            try {
              if (changedBudgets.length === 0) return;
              const body = {
                budgets: changedBudgets,
                partnerAccountId: currentAccount
              }
              const result = await changeBudgetCampaign(body)
              if (result && result.message == "OK") {
                notificationSimple(renderTranslateToastifyText(t('campaign_budget_page.budget_campaign')), NOTIFICATION_SUCCESS)
              }
              // setChangedBudgets([]);
              // setSelectedRowKeys([])
            } catch (error: any) {
              console.error('Error saving budgets:', error);
              notificationSimple(error.message, NOTIFICATION_ERROR)
            }
          };

          return (
            <div className='flex items-center justify-between'>
              {!isEditing 
                ? <div className='flex items-center'>￥ <span>{budget}</span></div>
                : (
                  <div className='current-budget'>
                    <Input type='number' min={0} value={budget} onChange={(e) => handleBudgetChange(e, index)} />
                  </div>
              )}
              <div className='flex ml-2' onClick={() => handleToggleEdit(selectedRowKeys, index)}>
                {isEditing ? <SaveOutlined className='text-lg cursor-pointer' onClick={saveChangedBudgets} /> : <EditOutlined className='text-lg cursor-pointer' />}
              </div>
            </div>
          );
        }
      },
      {
        title: <div className='text-center'>{t('metrics.imp')}</div>,
        dataIndex: 'imp',
        key: 'imp',
        render: (_: any, record: any) => {
          const imp = record.metrics && record.metrics.impressions ? record.metrics.impressions : "-"
          return <p className='text-end'>{imp}</p>
        },

        // sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: <div className='text-center'>{t('metrics.click')}</div>,
        dataIndex: 'click',
        key: 'click',
        render: (_: any, record: any) => {
          const click = record.metrics && record.metrics.clicks ? record.metrics.clicks : "-"
          return <p className='text-end'>{click}</p>
        },

        // // sorter: (a: any, b: any) => a.click - b.click
      },
      {
        title: <div className='text-center'>{t('metrics.sale')}</div>,
        dataIndex: 'sale',
        key: 'sale',
        render: (_: any, record: any) => {
          const sale = record.metrics && record.metrics.sales ? record.metrics.sales : "-"
          return <p className='text-end'>{sale}</p>
        },

        // sorter: (a: any, b: any) => a.sale - b.sale
      },
      {
        title: <div className='text-center'>{t('metrics.roas')}</div>,
        dataIndex: 'roas',
        key: 'roas',
        render: (_: any, record: any) => {
          const sale = record.metrics && record.metrics.sales ? record.metrics.sales : 0
          const cost = record.metrics && record.metrics.cost ? record.metrics.cost : 0
          const roas = sale && cost ? (sale / cost).toFixed(2) : "-"
          return <p className='text-end'>{roas}</p>
        },
        
        // sorter: (a: any, b: any) => a.roas - b.roas
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        render: (_: any, record: any) => {
          const {id, name} = record
          return (
            <div className='flex justify-center'>
              <Tooltip placement="top" title={"Log"} arrow={true}>
                <FileTextOutlined className='text-lg cursor-pointer is-link' onClick={() => router.push({pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}`, query: { id, name}})}/>
              </Tooltip>
            </div>
          )
        },
      },
    ], [campaignBudgets, handleToggleEdit, isEditingList, t]
  )
  
  const renderTranslateSearchText = (text: any) => {
    let translate = t("commons.search_by_text");
    return translate.replace("{text}", text);
  }

  const renderTranslateFilterText = (text: any) => {
    let translate = t("commons.filter_text");
    return translate.replace("{text}", text);
  }

  const renderTranslateToastifyText = (text: any) => {
    let translate = t("toastify.success.updated_text");
    return translate.replace("{text}", text);
  }

  return (
    <>
      <div className='flex items-center justify-between max-lg:flex-col max-lg:items-stretch'>
          <SearchInput keyword={keyword} name={"keyword"} placeholder={renderTranslateSearchText(t('campaign_budget_page.campaign_name'))} onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch}/>
        <div className='flex items-center gap-6 max-lg:mt-3 max-sm:flex-col max-sm:items-start'>
          {/* <SelectFilter placeholder={renderTranslateFilterText(t('campaign_budget_page.portfolio'))} onChange={handleSelectedPortfolio} options={statuses} /> */}
          <SelectFilter placeholder={renderTranslateFilterText(t('commons.status'))} onChange={handleSelectedStatus} options={statuses} />
          <SelectFilter placeholder={renderTranslateFilterText(t('commons.action'))} onChange={handleSelectedBulkAction} options={bulkAction} value={selectedAction}/>
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
    </>
  );
}


CampaignBudgets.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};
