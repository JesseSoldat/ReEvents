import { MODAL_CLOSE, MODAL_OPEN } from "./modalActions";

const initialState = null;

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case MODAL_CLOSE:
      return null;

    case MODAL_OPEN:
      const { modalType, modalProps } = payload;
      return { modalType, modalProps };

    default:
      return state;
  }
};
