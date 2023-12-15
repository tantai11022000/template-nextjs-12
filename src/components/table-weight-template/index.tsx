import React, { useMemo } from 'react';
import TableGeneral from '../table';
import { useTranslation } from 'next-i18next';
import { Input } from 'antd';

export interface IDataWeight {
    slot: number,
    time: string,
    weight: number
}

interface ITableWeightTemplate {
    timeSlot: number,
    dataWeight: IDataWeight[],
    isLoading: boolean,
    percentage: number,
    handleChangeValueTable: Function
}

const TableWeightTemplate = (props:ITableWeightTemplate) => {
    const {timeSlot, dataWeight, isLoading , percentage, handleChangeValueTable} = props
    const { t } = useTranslation()

    const columns: any = useMemo(
        () => [
          {
            title: <div className='text-center'>{`${t('weight_template_page.form.time')} ${timeSlot === 1 ? t('weight_template_page.form.hour') : t('weight_template_page.form.minute')}`}</div>,
            dataIndex: 'time',
            key: 'time',
            align: 'center',
            render: (text: any) => <span>{text}</span>
          },
          {
            title: (
              <div className='text-center'>
                {t('weight_template_page.form.weight_%')}
                <div className='text-red'>{percentage}% / 100%</div>
              </div>
            ),
            dataIndex: 'weight',
            key: 'weight',
            render: (text: any, record: any) => {
              const slot = record && record.slot ? record.slot : '';
              const weight = record && record.weight ? record.weight : 0;
              return (
                  <Input type='number' value={weight} min={0} onChange={(e) => handleChangeValueTable(e.target.value ? +e.target.value : 0,slot)} />
              );
            },
          },
        ], [timeSlot, t, percentage, dataWeight])

  return (
    <TableGeneral columns={columns} data={dataWeight} pagination={false} scrollY={500} loading={isLoading}/>
  )
};

export default TableWeightTemplate;