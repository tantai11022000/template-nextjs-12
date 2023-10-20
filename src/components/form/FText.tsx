import { Form, Input } from 'antd';
import * as React from 'react';

export interface IFTextProps {
  name: string | any[],
  label: string,
  required?: boolean,
  errorMessage?: string,
  onChange?: any
}

export default function FText (props: IFTextProps) {
  const {name, label, required, errorMessage, onChange} = props
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please input this field',
      }]}
    >
      <Input onChange={onChange}/>
    </Form.Item>
  );
}
