import { Button } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';


export interface IActionButtonProps {
  iconOnLeft?: any,
  iconOnRight?: any,
  className?: string,
  htmlType?: any,
  onClick?: any
  disabled?: any,
  label: any,
}

export default function ActionButton (props: IActionButtonProps) {
  const { iconOnLeft, iconOnRight, className, label, onClick, htmlType, disabled } = props
  return (
    <div className='button-container'>
      <Button htmlType={htmlType} className={`${className ? className : ""}`} onClick={onClick} disabled={disabled}>{iconOnLeft}{label}{iconOnRight}</Button>
    </div>
  );
}
