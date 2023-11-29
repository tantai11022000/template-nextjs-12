import React from 'react';
import dayjs from 'dayjs';
import type { TimeRangePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

interface IRangeDatePickerProps {
  onRangeChange: any,
  duration: any,
  showTime?: boolean
}

const RangeDatePicker = (props: IRangeDatePickerProps) => {
  const { t } = useTranslation()
  const { onRangeChange, duration, showTime } = props
  const { RangePicker } = DatePicker;

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: t('duration.today'), value: [dayjs().startOf('day'), dayjs().endOf('day')] },
    { label: t('duration.this_week'), value: [dayjs().startOf('week').add(1, 'day').startOf('day'), dayjs().endOf('week').add(1, 'day').endOf('day')] },
    { label: t('duration.this_month'), value: [dayjs().startOf('month'), dayjs().endOf('month')] },
    { label: t('duration.yesterday'), value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] },
    { label: t('duration.last_week'), value: [dayjs().subtract(1, 'week').startOf('week').add(1, 'day').startOf('day'), dayjs().subtract(1, 'week').endOf('week').add(1, 'day').endOf('day')]},
    { label: t('duration.last_month'), value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
    { label: t('duration.last_7_days'), value: [dayjs().subtract(7, 'd'), dayjs()] },
    { label: t('duration.last_14_days'), value: [dayjs().subtract(14, 'd'), dayjs()] },
    { label: t('duration.last_30_days'), value: [dayjs().subtract(30, 'd'), dayjs()] },
    { label: t('duration.last_90_days'), value: [dayjs().subtract(90, 'd'), dayjs()] },
    { label: t('duration.last_year'), value: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')] },
  ];

  return (
    <div className='range-date-picker-container'>
      <Space direction="vertical" size={12}>
        <RangePicker showTime={showTime ? true : false} format={showTime ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD"} defaultValue={[dayjs(duration && duration.startDate ? moment(duration.startDate).format("YYYY/MM/DD") : ""), dayjs(duration && duration.endDate ? moment(duration.endDate).format("YYYY/MM/DD") : "")]} presets={rangePresets} onChange={onRangeChange} />
      </Space>
    </div>
  )
};

export default RangeDatePicker;