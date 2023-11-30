import { Modal, Space } from 'antd';
import * as React from 'react';
import ActionButton from '../commons/buttons/ActionButton';
import { useTranslation } from 'next-i18next';

export interface IModalConfirmDeleteProps {
  openModal: boolean,
  onOk: any
  onCancel: any
}

export default function ModalConfirmDelete (props: IModalConfirmDeleteProps) {
  const { t } = useTranslation()
  const { openModal, onOk, onCancel } = props
  return (
    <Modal
      title="Are you sure that you want to delete this...?"
      open={openModal}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
    >
      <Space size="middle" className='w-full flex items-center justify-end mt-8'>
        <ActionButton className="cancel-button" label={t('commons.action_type.cancel')} onClick={onCancel} />
        <ActionButton className="finish-button" label={t('commons.action_type.confirm')} onClick={onOk}/>
      </Space>
    </Modal>
  );
}
