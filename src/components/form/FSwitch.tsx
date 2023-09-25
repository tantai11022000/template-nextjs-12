import { Checkbox, Form, Switch } from 'antd';
import React from 'react';

export interface IFSwitchProps {
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string
}

export default function FSwitch (props: IFSwitchProps) {
  const {name, label, required, errorMessage} = props
  return (
    <Form.Item 
      label={label}
      name={name}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'This field must be ON mode',
      }]}
      valuePropName={name}
    >
      <Switch/>
    </Form.Item>
  );
}
