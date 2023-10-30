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
  placeholder: string
}

export default function FSelect (props: IFSelectProps) {
  const {name, label, options, placeholder} = props
  return (
    <Form.Item
      name={name}
      label={label}
    >
      <Select placeholder={placeholder}>
        {options && options.map((option: any) => <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>)}
      </Select>
    </Form.Item>
  );
}
