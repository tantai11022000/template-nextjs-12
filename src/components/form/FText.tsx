import { Form, Input } from 'antd';
import React from 'react';

export interface IFTextProps {
  name: string | any[],
  label: string,
  required?: boolean,
  errorMessage?: string,
  onChange?: any,
  customCss? : any
}

export default function FText (props: IFTextProps) {
  const {name, label, required, errorMessage, onChange, customCss} = props
  return (
    <Form.Item
      className={customCss ? customCss : ''}
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
