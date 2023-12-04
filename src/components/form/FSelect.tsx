import { Form, Input, Radio, Select } from 'antd';
import React from 'react';

interface IOption {
  value: string | number,
  label: string | number
}

export interface IFSelectProps {
  name: string,
  label: string,
  options: IOption[],
  required?: boolean,
  errorMessage?: string,
  placeholder: string,
}

export default function FSelect (props: IFSelectProps) {
  const {name, label, options, placeholder, required, errorMessage} = props
  return (
    <Form.Item
      className='select-filter-container'
      name={name}
      label={label}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please select at least one',
      }]}
    >
      <Select placeholder={placeholder}>
        {options && options.map((option: any) => <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>)}
      </Select>
    </Form.Item>
  );
}
