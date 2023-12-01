import { Form, Input, Radio } from 'antd';
import React from 'react';

interface IOption {
  value: string | number,
  label: string | number
}

export interface IFRadioProps {
  name: string,
  label: string,
  options: IOption[],
  required?: boolean,
  errorMessage?: string,
  onChange?: any,
  value?: any,
  defaultValue?: any,
  disabled?: boolean
}

export default function FRadio (props: IFRadioProps) {
  const {name, label, options, onChange, value, defaultValue, required, errorMessage, disabled = false} = props
  return (
    <Form.Item
      name={name}
      label={label}
      className='radio-container'
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please select at least one Mode',
      }]}
    >
    <Radio.Group onChange={onChange} value={value} defaultValue={defaultValue} disabled={disabled}>
        {options && options.map((option: any) => <Radio key={option.value} value={option.value}>{option.label}</Radio>)}
    </Radio.Group>
    </Form.Item>
  );
}
