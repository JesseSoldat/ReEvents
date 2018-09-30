export const MODAL_CLOSE = "MODAL_CLOSE";
export const MODAL_OPEN = "MODAL_OPEN";

export const openModal = (modalType, modalProps) => {
  return {
    type: MODAL_OPEN,
    payload: {
      modalType,
      modalProps
    }
  };
};

export const closeModal = () => {
  return {
    type: MODAL_CLOSE
  };
};
