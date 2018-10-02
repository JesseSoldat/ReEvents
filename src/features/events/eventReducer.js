import {
  FETCH_EVENTS,
  CREATE_EVENT,
  DELETE_EVENT,
  UPDATE_EVENT
} from "./eventActions";

const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_EVENTS:
      return [...payload.events];

    case CREATE_EVENT:
      return [...state, Object.assign({}, payload.event)];

    default:
      return [...state];
  }
};
