import { atom } from 'recoil';

import { MODAL_TYPES } from '@components/modals/GlobalModal';
import { ConfirmModalProps } from '@components/modals/ConfirmModal';
import { GroupEditModalProps } from '@components/modals/GroupEditModal';
import { GroupNameModalProps } from '@components/modals/GroupNameModal';
import { SentenceEditModalProps } from '@components/modals/SentenceEditModal';
import { GroupSelectModalProps } from '@components/modals/GroupSelectModal';

export interface ConfirmModalType {
  modalType: typeof MODAL_TYPES.ConfirmModal;
  modalProps: ConfirmModalProps;
}
export interface GroupEditModalType {
  modalType: typeof MODAL_TYPES.GroupEditModal;
  modalProps: GroupEditModalProps;
}
export interface GroupNameModalType {
  modalType: typeof MODAL_TYPES.GroupNameModal;
  modalProps: GroupNameModalProps;
}
export interface SentenceEditModalType {
  modalType: typeof MODAL_TYPES.SentenceEditModal;
  modalProps: SentenceEditModalProps;
}

export interface GroupSelectModalType {
  modalType: typeof MODAL_TYPES.GroupSelectModal;
  modalProps: GroupSelectModalProps;
}

export type ModalType =
  | ConfirmModalType
  | GroupEditModalType
  | GroupNameModalType
  | SentenceEditModalType
  | GroupSelectModalType;

export const modalState = atom<ModalType | null>({
  key: 'modalState',
  default: null,
});
