import { Select, Typography } from 'antd';
import React from 'react';

export interface ISelectFilterProps {
  defaultValue?: string,
  showSearch?: boolean,
  label?: string,
  placeholder: string
  onChange: any
  options: any
}

export default function SelectFilter (props: ISelectFilterProps) {
  const { label, defaultValue, showSearch, placeholder, onChange, options} = props
  const { Text } = Typography
  return (
    <div className='select-filter-container'>
      <Text className='mr-6'>{label}</Text>
      <Select
        optionFilterProp="label"
        style={{width: 250}}
        showSearch={!showSearch ? false : showSearch}
        defaultValue={defaultValue ? defaultValue : null}
        placeholder={placeholder}
        onChange={onChange}
        options={options}
      />
    </div>
  );
}