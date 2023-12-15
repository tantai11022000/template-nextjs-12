import { Form, Input, Radio, Select, Upload } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface IOption {
  value: string | number,
  label: string | number
}

export interface IFUploadFileProps {
  name: string,
  label: string,
  required?: boolean,
  errorMessage?: string,
  action?: string,
  onUploadFile: any,
  multiple?: boolean,
  acceptType?: string
}

export default function FUploadFile (props: IFUploadFileProps) {
  const { t } = useTranslation()
  const {name, label, action, onUploadFile, multiple, required, errorMessage, acceptType} = props

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form.Item label={label} className='upload-container'>
      <Form.Item 
        name={name} 
        valuePropName="fileList" 
        getValueFromEvent={onUploadFile} 
        noStyle
        rules={[{
          required: required ? true : false, 
          message: errorMessage ? errorMessage : 'Please select at least one',
        }]}
      >
        <Upload.Dragger name="files" maxCount={multiple ? undefined : 1} beforeUpload={() => false} accept={acceptType}>
          <div className='flex items-end justify-center'>
            <p className="ant-upload-drag-icon"><CloudUploadOutlined /></p>
            <p className="ant-upload-text">{t('update_campaign_schedule_page.main_upload_content')}</p>
          </div>
          <p className="ant-upload-hint">({t('update_campaign_schedule_page.sub_upload_content')} *.CSV)</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>
  );
}
