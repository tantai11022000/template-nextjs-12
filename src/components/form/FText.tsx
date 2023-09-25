import { Form, Input } from 'antd';
import * as React from 'react';

export interface IFTextProps {
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string
}

export default function FText (props: IFTextProps) {
  const {name, label, required, errorMessage} = props
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please input this field',
      }]}
    >
      <Input />
    </Form.Item>
  );
}
