import { Form, Input, Radio, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React from 'react';

interface IOption {
  value: string | number,
  label: string | number
}

export interface IFUploadFileProps {
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string,
}

export default function FUploadFile (props: IFUploadFileProps) {
  const {name, label} = props

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form.Item label={label}>
      <Form.Item name={name} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger name="files" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          <p className="ant-upload-text">Note: CSV only - max file size: 2MB.</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>
  );
}
