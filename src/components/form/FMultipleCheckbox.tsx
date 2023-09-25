import { Checkbox, Form } from 'antd';
import React from 'react';

export interface IFMultipleCheckboxProps {
  data: any,
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string,
  onChange: any
}

export interface IFMultipleCheckboxProps {
}

export default function FMultipleCheckbox (props: IFMultipleCheckboxProps) {
  const {name, label, required, errorMessage, data, onChange, } = props
  return (
    <Form.Item 
      name={name}
      label={label}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please select at least one',
      }]}
    >
      <Checkbox.Group onChange={onChange}>
        {data ? data.map((data: any, index: number) => (
          <Checkbox key={data.id ? data.id : index} value={data.value}>
              {data.name ? data.name : data.value ? data.value : ""}
          </Checkbox>
          )) : null}
      </Checkbox.Group>
    </Form.Item>
  );
}
