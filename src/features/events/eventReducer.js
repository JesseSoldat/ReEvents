import { FETCH_EVENTS, RESET_EVENTS } from "./eventActions";

const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_EVENTS:
      return [...payload.events];

    case RESET_EVENTS:
      return [];

    default:
      return [...state];
  }
};
