import { Select, Typography } from 'antd';
import React from 'react';

export interface ISelectFilterProps {
  defaultValue?: string,
  showSearch?: boolean,
  label?: string,
  value?: any,
  placeholder: string
  onChange: any
  options: any
}

export default function SelectFilter (props: ISelectFilterProps) {
  const { label, defaultValue, showSearch, placeholder, onChange, options, value} = props
  const { Text } = Typography
  return (
    <div className='select-filter-container'>
      <Text className='mr-6'>{label}</Text>
      <Select
        optionFilterProp="label"
        // style={{width: 250}}
        className='max-w-[250px] w-[150px]'
        showSearch={!showSearch ? false : showSearch}
        defaultValue={defaultValue ? defaultValue : null}
        placeholder={placeholder}
        onChange={onChange}
        options={options}
        value={value}
      />
    </div>
  );
}
