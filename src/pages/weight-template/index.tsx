import React, { useEffect, useMemo, useState } from 'react';
import qs from 'query-string';
import RootLayout from '../../components/layout';
import DashboardLayout from '../../components/nested-layout/DashboardLayout';
import { Modal, Space, Tooltip } from 'antd';
import TableGeneral from '@/components/table';
import { DeleteOutlined, EditOutlined, PlusOutlined, CopyOutlined} from '@ant-design/icons';
import moment from 'moment';
import { changeNextPageUrl, notificationSimple, updateUrlQuery } from '@/utils/CommonUtils';
import { useRouter } from 'next/router';
import { BREADCRUMB_WEIGHT_TEMPLATE } from '@/Constant/index';
import { useAppDispatch } from '@/store/hook';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import SearchInput from '@/components/commons/textInputs/SearchInput';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { deleteWeightTemplate, getAllWeightTemplates } from '@/services/weight-template';
import { useTranslation } from 'next-i18next';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';
import EditWeightTemplate from '@/components/modals/editWeightTemplate';

export async function getStaticProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

function WeightTemplate() {
  const { t } = useTranslation()
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })
  const [weightTemplates, setWeightTemplates] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [openModalCloneWeightTemplate, setOpenModalCloneWeightTemplate] = useState<boolean>(false)
  const [weightTemplateInfo, setWeightTemplateInfo] = useState<any>({
    id: "",
    name: ""
  })

  useEffect(() => {
    // mapFirstQuery()
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.target_bidding') , url: '/targeting-bidding'}]}))
  },[])

  useEffect(() => {
    init()
  }, [pagination.pageSize, pagination.current])

  const init = () => {
    fetchAllWeightTemplates(keyword)
  }
  
  const handleOnSearch = async(value: string) => {
    setKeyword(value)
    const params = {
      keyword: value,
      page: 1
    }
    setPagination({
      ...pagination,
      current:1
    })
    // updateUrlQuery(router,params)
    fetchAllWeightTemplates(value);
  }

  const fetchAllWeightTemplates = async (keywords: string) => {
    setLoading(true)
    try {
      const {pageSize, current} = pagination
      var params = {
        page: current,
        pageSize,
        keywords
      }
      const result = await getAllWeightTemplates(params)
      if (result && result.data) {
        setWeightTemplates(result.data)
        setPagination({...pagination, total: result.pagination.total})
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> Get Weight Template Error", error)
      setLoading(false)
    }
  }

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const {current} = pagination
    // changeNextPageUrl(router,current)
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

  const deleteTemplate = async (id: number, name: string) => {
    try {
      const result = await deleteWeightTemplate(id)
      setWeightTemplates((prevTemplates: any) => prevTemplates.filter((template: any) => template.id !== id));
      notificationSimple(renderTranslateToastifyText(t('weight_template_page.weight_template')), NOTIFICATION_SUCCESS)
      
    } catch (error: any) {
      console.log(">>> Delete Weight Template Error", error)
      notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
    }    
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

  const handleOk = () => {
    setOpenModalCloneWeightTemplate(false);
  };

  const handleCancel = () => {
    setOpenModalCloneWeightTemplate(false);
  };

  const columns: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('commons.id')}</div>,
        dataIndex: 'id',
        key: 'id',
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: <div className='text-center'>{t('weight_template_page.template_name')}</div>,
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: <div className='text-center'>{t('weight_template_page.description')}</div>,
        dataIndex: 'description',
        key: 'description',
        render: (text: any) => <div>{text}</div>,
        width: 500,
      },
      {
        title: <div className='text-center'>{t('weight_template_page.last_updated')}</div>,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text: any) => <div>{moment().format('DD-MM-YYYY')}</div>,
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        align: 'center',
        width: 100,
        render: (_: any, record: any) => {
          const { id, name } = record

          const handleCloneWeightTemplate = () => {
            setOpenModalCloneWeightTemplate(!openModalCloneWeightTemplate)
            setWeightTemplateInfo({id, name})
          }

          return (
            <div className='flex justify-center'>
              <Space size="middle">
                <Tooltip placement="top" title={"Clone Weight Template"} arrow={true}>
                  <CopyOutlined className='text-lg cursor-pointer' onClick={handleCloneWeightTemplate} />
                </Tooltip>

                <Tooltip placement="top" title={"Edit"} arrow={true}>
                  <EditOutlined className='text-lg cursor-pointer' onClick={() => router.push(`${BREADCRUMB_WEIGHT_TEMPLATE.url}/edit/${record.id}`)}/>
                </Tooltip>

                <Tooltip placement="top" title={"Delete"} arrow={true}>
                  <DeleteOutlined className='text-lg cursor-pointer' onClick={() => deleteTemplate(id, name)}/>
                </Tooltip>
              </Space>
            </div>
          )
        },
      },
    ], [weightTemplates, t])
  
  return (
    <div>
      <Space className='w-full flex flex-row justify-between'>
        <SearchInput keyword={keyword} name="keyword" placeholder={renderTranslateSearchText(t('weight_template_page.template_name'))} onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleOnSearch}/>
        <ActionButton className={'action-button'} iconOnLeft={<PlusOutlined />} label={renderTranslateActionButton(t('weight_template_page.weight_template'))} onClick={() => router.push(`${BREADCRUMB_WEIGHT_TEMPLATE.url}/add`)}/>
      </Space>
      <div>
        <TableGeneral loading={loading} columns={columns} data={weightTemplates} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>

      {openModalCloneWeightTemplate && (
        <Modal width={1000} open={openModalCloneWeightTemplate} onOk={handleOk} onCancel={handleCancel} footer={null}>
          <EditWeightTemplate weightTemplate={weightTemplateInfo} onOk={handleOk} onCancel={handleCancel} refreshData={fetchAllWeightTemplates}/>
        </Modal>
      )}
    </div>
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