import { Input } from 'antd';
import React from 'react';

export interface ITextInputProps {
}

export default function TextInput (props: ITextInputProps) {
  return (
    <div className='text-input-container'>
      <Input/>
    </div>
  );
}
