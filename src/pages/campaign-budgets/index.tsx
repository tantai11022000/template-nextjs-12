import React, {useEffect, useMemo, useState} from 'react';
import qs from 'query-string';
import { Dropdown, Input, Menu, Space, Switch, Tag, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TableGeneral from '@/components/table';
import { changeBudgetCampaign, changeStatusCampaign, exportCampaignsCSVFile, getCampaignBudgets } from '@/services/campaign-budgets-services';
import { Modal } from 'antd';
import { useRouter } from 'next/router';
import { changeNextPageUrl, formatNumber, notificationSimple, updateUrlQuery } from '@/utils/CommonUtils';
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
import { getCampaignStatus, getPortfolio } from '@/services/commons-service';
import FileSaver from 'file-saver';
import { getItem } from '@/utils/StorageUtils';
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

export interface ICampaignBudgetsProps {
}


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
  const currentAccount = getItem(CURRENT_ACCOUNT)
  const isSync = useAppSelector(getIsSyncData)
  const dispatch = useAppDispatch()

  const [openModalUpdateStatus, setOpenModalUpdateStatus] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<any>('');
  const [statuses, setStatuses] = useState<any[]>([])
  const [bulkAction, setBulkAction] = useState<any[]>(BULK_ACTION)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>()
  const [selectedRowsWithCampaignName, setSelectedRowsWithCampaignName] = useState<any>()
  const [selectedRowsWithIsHaveSchedule, setSelectedRowsWithIsHaveSchedule] = useState<any>()
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditingList, setIsEditingList] = useState(
    campaignBudgets ? campaignBudgets.map(() => false) : []
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
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [mappingPortfolio, setMappingPortfolio] = useState<any[]>([])
  const [portfolioId, setPortfolioId] = useState<string>("")

  useEffect(() => {
    const newData = portfolio.map((data: any) => ({
      value: data.portfolioId,
      label: data.name
    }))
    newData.unshift({
      value: null,
      label: "All"
    })
    setMappingPortfolio(newData)
  }, [portfolio])

  useEffect(() => {
    fetchCampaignStatus()
  }, [])

  useEffect(() => {
    // mapFirstQuery()
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.campaign_budgets') , url: '/campaign-budgets'}]}))
  }, [])

  useEffect(() => {
    if (currentAccount) {
      getCampaignBudgetsList(currentAccount, keyword, status, sort, portfolioId)
      fetchPortfolio(currentAccount)
    }
  }, [currentAccount, pagination.pageSize, pagination.current, status, sort, portfolioId])

  useEffect(() => {
    if (isSync) { 
      getCampaignBudgetsList(currentAccount, keyword, status, sort, portfolioId)
      dispatch(setSyncData({data: false}))
    }
  }, [isSync])

  useEffect(() => {
    setSelectedAction(renderTranslateFilterText(t('commons.action')))
  }, [t])
  
  const getCampaignBudgetsList = async (partnerAccountId: any, keywords: string, status: number | undefined, sort: any, portfolioId: string) => {
    setLoading(true)
    try {
      const {pageSize, current} = pagination
      var params = {
        page: current,
        pageSize,
        keywords,
        isGetMetric: true,
        status,
        portfolioId,
        ...sort
      }

      const result = await getCampaignBudgets(partnerAccountId, params)
      if (result && result.data && result.data.results) {
        setCampaignBudgets(result.data.results)
        setPagination({...pagination, total: result.pagination.total})
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> Get Campaign BudgetsList Error", error)
      setLoading(false)
    }
  }

  const fetchPortfolio = async (partnerAccountId: any) => {
    try {
      const result = await getPortfolio(partnerAccountId)
      if (result && result.data){
        setPortfolio(result.data)
      }
    } catch (error) {
      console.log(">>> Fetch Portfolio Error", error)
    }
  }

  const fetchCampaignStatus = async () => {
    try {
      const result = await getCampaignStatus()
      if (result && result.data) {
        const newData = result.data.map((data: any) => ({
          value: data.code,
          label: data.name
        }))
        newData.unshift({
          value: null,
          label: "All"
        })
        setStatuses(newData)
      }
    } catch (error) {
      console.log(">>> Fetch Campaign Status Error", error)
    }
  }

  const onExportCsvFile = async (campaignIds: any, partnerAccountId: any, keywords: string, status: number | undefined, sort: any) => {
    try {
      const params = {
        sort,
        keywords,
        status
      }
      
      const body = {
        campaignIds,
        partnerAccountId
      }
      const result = await exportCampaignsCSVFile(params, body)
      handleServerResponse(result)
    } catch (error: any) {
      console.log(">>> Export Csv File Error", error)
      notificationSimple(t('campaign_budget_page.warning_select_at_least_one_campaign'), NOTIFICATION_ERROR)
    }
  }

  const handleServerResponse = (excel: any) => {
    const file = new Blob([excel], { type: 'text/csv;charset=utf-8' });
    const fileName = `Export_Campaigns.csv`;
    try {
        FileSaver.saveAs(file, fileName);
      } catch (error) {
        console.log('error :>> ', error);
        notificationSimple(t("notification.some_thing_went_wrong"), NOTIFICATION_ERROR);
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
    getCampaignBudgetsList(currentAccount, value, status, sort, portfolioId)
    // updateUrlQuery(router, params)
  }

  const handleSelectedBulkAction = (values: any) => {
    const { value } = values
    if (value == 1) {
      setOpenModalUpdateStatus(true)
    } else if (value == 2) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`)
    } else if (value == 3) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`)
    } else if (value == 4) {
      if (selectedRowKeys == undefined) {
        notificationSimple(t('campaign_budget_page.warning_select_at_least_one_campaign'), NOTIFICATION_ERROR)
      } else {
          const query = {
            campaignIds: selectedRowKeys,
            campaignNames: selectedRowsWithCampaignName,
            isHaveSchedule: selectedRowsWithIsHaveSchedule
          }
          const encodeQueryData = btoa(unescape(encodeURIComponent(JSON.stringify(query))))
          router.push({
            pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
            query: {
              campaigns: encodeQueryData
            }
          })
      }
    } else if (value == 5) {
      if (selectedRowKeys == undefined) {
        notificationSimple(t('campaign_budget_page.warning_select_at_least_one_campaign'), NOTIFICATION_ERROR)
      } else {
        const query = {
          isWeight: true,
          campaignIds: selectedRowKeys,
          campaignNames: selectedRowsWithCampaignName,
          isHaveSchedule: selectedRowsWithIsHaveSchedule
        }
        const encodeQueryData = btoa(unescape(encodeURIComponent(JSON.stringify(query))))
        router.push({
          pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
          query: {
            campaigns: encodeQueryData
          }
        })
      }
    } else if (value == 6) {
      onExportCsvFile(selectedRowKeys, currentAccount, keyword, 0, sort )
    }
    setSelectedAction(renderTranslateFilterText(t('commons.action')))
  };

  const handleSelectedStatus = (values: any) => {
    const { value } = values
    setStatus(value)
  };

  const handleSelectedPortfolio = (values: any) => {
    const { value } = values
    setPortfolioId(value)
  };
  const handleOnChangeTable = (pagination:any, filters: any, sorter: any) => {
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
    setSort(sort)
    


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
  
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);

      const campaignNames = selectedRows.map((row: any) => row.name);
      setSelectedRowsWithCampaignName(campaignNames)

      const campaignIsHaveSchedule = selectedRows.map((row: any) => row.adtranAmazonCampaignBudgetSchedule == null ? false : true);
      setSelectedRowsWithIsHaveSchedule(campaignIsHaveSchedule)
    },
    getCheckboxProps: (record: any) => ({
      id: record.id,
      name: record.name
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
          const { id } = record
          const statusData = record.status

          const statusType = {
            isEnabled: statuses.filter((status: any) => status.label != "ENABLED" && status.label != "All"),
            isPaused: statuses.filter((status: any) => status.label != "PAUSED" && status.label != "All"),
            isArchived: statuses.filter((status: any) => status.label != "ARCHIVED" && status.label != "All"),
            isEnded: statuses.filter((status: any) => status.label != "ENDED" && status.label != "All"),
            isOther: statuses.filter((status: any) => status.label != "OTHER" && status.label != "All")
          }

          const renderStatusesDropdown = (statusType: any) => {
            return (
              <Menu onClick={({ key }) => onUpdateCampaignStatus(key)}>
                {statusType.map((status: any) => (
                  <Menu.Item className='text-center' key={status.value}>{status.label}</Menu.Item>
                ))}
              </Menu>
            )
          }

          const onUpdateCampaignStatus = async (newStatus: any) => {
            try {
              const body = {
                statuses: [{
                  status: newStatus,
                  campaignId: id
                }],
                partnerAccountId: currentAccount
              }
        
              const result = await changeStatusCampaign(body)
              if (result && result.message == "OK") {
                notificationSimple(renderTranslateToastifyText(t('commons.status')), NOTIFICATION_SUCCESS)
                
                const updatedCampaigns = campaignBudgets.map((campaign: any) => {
                  if (campaign.id === id) {
                    return {...campaign, status: newStatus};
                  }
                  return campaign;
                });
                setCampaignBudgets(updatedCampaigns);
              }
            } catch (error: any) {
              console.log(">>> Update Campaign Status Error", error)
              notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
            }
          }

          const renderStatus = () => {
            let renderStatus = ''
            let renderType = ''
            let renderDropdown: any
            if (statusData == CAMPAIGN_STATUS.ENABLE) {
              renderStatus = t('commons.status_enum.enable')
              renderType = 'success'
              renderDropdown = renderStatusesDropdown(statusType.isEnabled)
            } else if (statusData == CAMPAIGN_STATUS.PAUSED) {
              renderStatus = t('commons.status_enum.paused')
              renderType = 'warning'
              renderDropdown = renderStatusesDropdown(statusType.isPaused)
            } else if (statusData == CAMPAIGN_STATUS.ARCHIVED) {
              renderStatus = t('commons.status_enum.archived')
              renderType = 'processing'
              renderDropdown = renderStatusesDropdown(statusType.isArchived)
            } else if (statusData == CAMPAIGN_STATUS.ENDED) {
              renderStatus = t('commons.status_enum.ended')
              renderType = 'error'
              renderDropdown = renderStatusesDropdown(statusType.isEnded)
            } else if (statusData == CAMPAIGN_STATUS.OTHER) {
              renderStatus = t('commons.status_enum.other')
              renderType = 'default'
              renderDropdown = renderStatusesDropdown(statusType.isOther)
            }
            return (
              <Dropdown overlay={renderDropdown} placement="bottomCenter" >
                <a className='tag px-2 font-semibold'><Tag className='text-center uppercase' color={renderType}>{renderStatus} <DownOutlined/></Tag></a>
              </Dropdown> 
            )
          }
          return (
            <div className='flex justify-center'>
              {renderStatus()}
            </div>
          );
        }
      },
      {
        title: <div className='text-center'>{t('campaign_budget_page.current_budget')}</div>,
        dataIndex: 'budget',
        key: 'budget',
        render: (text: any, record: any, index: number) => {
          const id = record.id
          const budget = record.adtranAmazonCampaignBudget.dailyBudget
          const isEditing = isEditingList[index];

          const handleToggleEdit = (index: any) => {
            const updatedIsEditingList = [...isEditingList];
            updatedIsEditingList[index] = !updatedIsEditingList[index];
            setIsEditingList(updatedIsEditingList);
          };

          const handleBudgetChange = (event: any, index: any) => {
            const updatedBudgets = [...campaignBudgets];
            const newBudgetValue = Math.abs(event.target.value);
            const campaignId = updatedBudgets[index].id;
            updatedBudgets[index].adtranAmazonCampaignBudget.dailyBudget = newBudgetValue
            setCampaignBudgets(updatedBudgets);

            const existingBudgetIndex = changedBudgets.findIndex((budget) => budget.campaignId === campaignId);
            if (existingBudgetIndex !== -1) {
              const updatedChangedBudgets = [...changedBudgets];
              updatedChangedBudgets[existingBudgetIndex] = {
                value: newBudgetValue,
                campaignId: campaignId,
              };
              setChangedBudgets(updatedChangedBudgets);
            } else {
              setChangedBudgets((prevBudgets) => [
                ...prevBudgets,
                { value: newBudgetValue, campaignId: campaignId }
              ]);
            }
          };
                
          const saveChangedBudgets = async (idCampaignToSave: any) => {
            try {
              const indexCampaign = changedBudgets.filter((campaign: any) => campaign.campaignId == idCampaignToSave)
              if (indexCampaign.length <= 0) return
              const body = {
                budgets: indexCampaign,
                partnerAccountId: currentAccount
              }
              const result = await changeBudgetCampaign(body)
              if (result && result.message == "OK") {
                notificationSimple(renderTranslateToastifyText(t('campaign_budget_page.budget_campaign')), NOTIFICATION_SUCCESS)
              }
            } catch (error: any) {
              console.log(">>> Change Budget Error", error)
              notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
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
              <div className='flex ml-2' onClick={() => handleToggleEdit(index)}>
                {isEditing ? <SaveOutlined className='text-lg cursor-pointer' onClick={() => saveChangedBudgets(id)} /> : <EditOutlined className='text-lg cursor-pointer' />}
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
          const imp = record.metrics && record.metrics.impressions ? formatNumber(record.metrics.impressions) : "-"
          return <p className='text-end'>{imp}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.click')}</div>,
        dataIndex: 'click',
        key: 'click',
        render: (_: any, record: any) => {
          const click = record.metrics && record.metrics.clicks ? formatNumber(record.metrics.clicks) : "-"
          return <p className='text-end'>{click}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.sale')}</div>,
        dataIndex: 'sale',
        key: 'sale',
        render: (_: any, record: any) => {
          const sale = record.metrics && record.metrics.sales ? formatNumber(record.metrics.sales) : "-"
          return <p className='text-end'>{sale}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.roas')}</div>,
        dataIndex: 'roas',
        key: 'roas',
        render: (_: any, record: any) => {
          const sale = record.metrics && record.metrics.sales ? record.metrics.sales : 0
          const cost = record.metrics && record.metrics.cost ? record.metrics.cost : 0
          const roas = sale && cost ? formatNumber((sale / cost)) : "-"
          return <p className='text-end'>{roas}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        render: (_: any, record: any) => {
          const { id, name } = record
          const goToCampaignLog = () => {
            const campaign = {
              id,
              name
            }
            router.push({
              pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}`,
              query: {campaign: JSON.stringify(campaign)}
            })
          }
          return (
            <div className='flex justify-center'>
              <Tooltip placement="top" title={t('commons.action_type.log')} arrow={true}>
                <FileTextOutlined className='text-lg cursor-pointer' onClick={goToCampaignLog}/>
              </Tooltip>
            </div>
          )
        },
      },
    ], [campaignBudgets, isEditingList, t]
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
      <div className='flex items-center justify-between max-xl:flex-col max-xl:items-stretch'>
          <SearchInput keyword={keyword} name={"keyword"} placeholder={renderTranslateSearchText(t('campaign_budget_page.campaign_name'))} onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch}/>
        <div className='flex items-center gap-6 max-xl:mt-3 max-lg:flex-col max-lg:items-start'>
          <SelectFilter placeholder={renderTranslateFilterText(t('campaign_budget_page.portfolio'))} onChange={handleSelectedPortfolio} options={mappingPortfolio} />
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
