import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, Space } from 'antd';
import type { DatePickerProps } from 'antd/es/date-picker';
interface IDateTimePickerProps {

}

const DateTimePicker = (props: IDateTimePickerProps) => {

  const onChange = (
    value: DatePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };
  
  const onOk = (value: DatePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  return (
    <div className='range-date-picker-container'>
      <Space direction="vertical" size={12}>
        <DatePicker defaultValue={dayjs()} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onChange} onOk={onOk} />
      </Space>
    </div>
  )
};

export default DateTimePicker;