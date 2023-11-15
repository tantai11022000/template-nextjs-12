import { Checkbox, Col, Form, Row, Spin } from 'antd';
import React from 'react';

export interface IFMultipleCheckboxProps {
  data: any,
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string,
  onChange?: any,
  loading?: any
}

export interface IFMultipleCheckboxProps {
}

export default function FMultipleCheckbox (props: IFMultipleCheckboxProps) {
  const {name, label, required, errorMessage, data, onChange, loading} = props
  return (
    <Form.Item 
      name={name}
      label={label}
      rules={[{
        required: required ? true : false, 
        message: errorMessage ? errorMessage : 'Please select at least one',
      }]}
    >
      {loading ? <Spin/> : (
        <Checkbox.Group onChange={onChange}>
          <Row>
            {data ? data.map((data: any, index: number) => (
              <Col span={8} key={data.id ? data.id : index}>
                <Checkbox value={data.value}>
                    {data.name ? data.name : data.value ? data.value : ""}
                </Checkbox>
              </Col>
            )) : null }
          </Row>
        </Checkbox.Group>
      )}
    </Form.Item>
  );
}
