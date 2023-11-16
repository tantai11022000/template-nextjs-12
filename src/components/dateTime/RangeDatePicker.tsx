import React from 'react';
import dayjs from 'dayjs';
import type { TimeRangePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

export interface IRangeDatePickerProps {
  onRangeChange: any,
  duration: any
}

const RangeDatePicker = (props: IRangeDatePickerProps) => {
  const { t } = useTranslation()
  const { onRangeChange, duration } = props
  const { RangePicker } = DatePicker;

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: t('duration.last_7_days'), value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: t('duration.last_14_days'), value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: t('duration.last_30_days'), value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: t('duration.last_90_days'), value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

  return (
    <div className='range-date-picker-container'>
      <Space direction="vertical" size={12}>
        <RangePicker defaultValue={[dayjs(duration && duration.startDate ? moment(duration.startDate).format("YYYY/MM/DD") : ""), dayjs(duration && duration.endDate ? moment(duration.endDate).format("YYYY/MM/DD") : "")]} presets={rangePresets} onChange={onRangeChange} />
      </Space>
    </div>
  )
};

export default RangeDatePicker;