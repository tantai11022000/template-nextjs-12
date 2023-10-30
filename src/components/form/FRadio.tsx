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
}

export default function FRadio (props: IFRadioProps) {
  const {name, label, options} = props
  return (
    <Form.Item
      name={name}
      label={label}
    >
    <Radio.Group>
        {options && options.map((option: any) => <Radio key={option.value} value={option.value}>{option.label}</Radio>)}
    </Radio.Group>
    </Form.Item>
  );
}