import { Checkbox, Form, Switch } from 'antd';
import React from 'react';

export interface IFSwitchProps {
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string,
  status: boolean,
  disable?: boolean
}

export default function FSwitch (props: IFSwitchProps) {
  const {name, label, required, errorMessage, status, disable} = props
  return (
    <Form.Item 
      label={label}
      name={name}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'This field must be ON mode',
      }]}
      initialValue={status}
      valuePropName={status ? "checked" : ""}
      style={{display: disable ? "none" : ""}}
    >
      <Switch/>
    </Form.Item>
  );
}
