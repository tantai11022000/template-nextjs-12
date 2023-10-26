import React from 'react';
import { DatePicker, Space } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

const onChange = (
  value: DatePickerProps['value'] | RangePickerProps['value'],
  dateString: [string, string] | string,
) => {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
};

const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  console.log('onOk: ', value);
};

const DateTimePicker: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onChange} onOk={onOk} />
  </Space>
);

export default DateTimePicker;