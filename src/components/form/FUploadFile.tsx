import { Form, Input, Radio, Select, Upload } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
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
    <Form.Item label={label} className='upload-container'>
      <Form.Item name={name} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger name="files" action="/upload.do">
          <div className='flex items-end justify-center'>
            <p className="ant-upload-drag-icon"><CloudUploadOutlined /></p>
            <p className="ant-upload-text">Drop file here or click to browse</p>
          </div>
          <p className="ant-upload-hint">(Allowed file types: *.CSV,*.xls,*.xlsx)</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>
  );
}
