import { Button } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';


export interface IActionButtonProps {
  icon: any,
  label: string,
  onClick: any
}

export default function ActionButton (props: IActionButtonProps) {
  const { icon, label, onClick } = props
  return (
    <div className='button-container'>
      <Button icon={icon} onClick={onClick}>{label}</Button>
    </div>
  );
}
