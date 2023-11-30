import React from 'react';
import { HomeFilled } from '@ant-design/icons';
import { Breadcrumb} from 'antd';
import { useAppSelector } from '@/store/hook';
import { getBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import Link from 'next/link';

export interface IBreadcrumbsProps {
}

export default function Breadcrumbs (props: IBreadcrumbsProps) {
  const breadcrumb = useAppSelector(getBreadcrumb);

  return (
    <div className='breadcrumb-container'>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link href="/"><HomeFilled className='text-xs'/></Link>
        </Breadcrumb.Item>
          {breadcrumb ? breadcrumb.map((item:any, index: number) => (
              <Breadcrumb.Item key={index} className='cursor-pointer'>
                {item.url 
                  ?  <Link href={item.url}><span className="active">{item.label}</span></Link> 
                  :  <span className="active">{item.label}</span>
                }
              </Breadcrumb.Item>
          )) : null}
      </Breadcrumb>
    </div>
  );
}
