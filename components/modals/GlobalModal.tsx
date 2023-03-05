import React from 'react';
import { useRecoilState } from 'recoil';

import ConfirmModal from '@components/modals/ConfirmModal';
import GroupEditModal from '@components/modals/GroupEditModal';
import GroupNameModal from '@components/modals/GroupNameModal';
import SentenceEditModal from '@components/modals/SentenceEditModal';
import { modalState } from '@recoil/atoms/modals';

export const MODAL_TYPES = {
  ConfirmModal: 'ConfirmModal',
  GroupEditModal: 'GroupEditModal',
  GroupNameModal: 'GroupNameModal',
  SentenceEditModal: 'SentenceEditModal',
} as const;

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.ConfirmModal]: ConfirmModal,
  [MODAL_TYPES.GroupEditModal]: GroupEditModal,
  [MODAL_TYPES.GroupNameModal]: GroupNameModal,
  [MODAL_TYPES.SentenceEditModal]: SentenceEditModal,
};

const GlobalModal = () => {
  const { modalType, modalProps } = useRecoilState(modalState)[0] || {};

  const renderComponent = () => {
    if (!modalType) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];

    return <ModalComponent {...modalProps} />;
  };

  return <>{renderComponent()}</>;
};

export default GlobalModal;
