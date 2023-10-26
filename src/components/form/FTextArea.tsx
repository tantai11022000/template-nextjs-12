import { Form, Input } from 'antd';
import React from 'react';

export interface IFTextAreaProps {
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string,
  rows?: number
}

export default function FTextArea (props: IFTextAreaProps) {
  const {name, label, required, errorMessage, rows} = props
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please input this field',
      }]}
    >
      <Input.TextArea rows={rows ? rows : 5} />
    </Form.Item>
  );
}
