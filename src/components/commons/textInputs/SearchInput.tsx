import React from 'react';
import { Input } from 'antd';

export interface ISearchInputProps {
  keyword: string,
  name: string,
  placeholder: string,
  onChange: any,
  onSearch: any
}

export default function SearchInput (props: ISearchInputProps) {
  const { Search } = Input;
  const { keyword, name, placeholder, onChange, onSearch } = props
  return (
    <div className='search-container'>
      <Search allowClear value={keyword} name={name} placeholder={placeholder} onChange={onChange} onSearch={onSearch} />
    </div>
  );
}
