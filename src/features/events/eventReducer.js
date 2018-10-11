import {
  FETCH_EVENTS,
  FETCH_EVENT,
  RESET_EVENTS,
  RESET_EVENT
} from "./eventActions";

const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_EVENTS:
      return [...payload.events];

    case RESET_EVENTS:
      return [];

    case FETCH_EVENT:
      return [payload.event];

    case RESET_EVENT:
      return [];

    default:
      return [...state];
  }
};
