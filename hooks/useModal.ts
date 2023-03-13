import { useRecoilState } from 'recoil';

import { modalState, ModalType } from '@recoil/atoms/modals';

export default function useModal() {
  const [modal, setModal] = useRecoilState(modalState);

  const showModal = ({ modalType, modalProps }: ModalType) => {
    if (modalType === 'ConfirmModal') {
      setModal({ modalType, modalProps });
    }

    if (modalType === 'GroupEditModal') {
      setModal({ modalType, modalProps });
    }

    if (modalType === 'GroupNameModal') {
      setModal({ modalType, modalProps });
    }

    if (modalType === 'SentenceEditModal') {
      setModal({ modalType, modalProps });
    }

    if (modalType === 'GroupSelectModal') {
      setModal({ modalType, modalProps });
    }
  };

  const hideModal = () => {
    setModal(null);
  };

  return {
    modal,
    setModal,
    showModal,
    hideModal,
  };
}
