import {
  FETCH_EVENTS,
  FETCH_EVENT,
  RESET_EVENTS,
  RESET_EVENT
} from "./eventActions";
import { GOING_TO_EVENT, CANCEL_GOING_TO_EVENT } from "../user/userActions";

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

    case GOING_TO_EVENT:
      let going = [...state];
      const { attendee } = payload;
      if (going[0]) {
        going[0]["attendees"][attendee.id] = attendee;
      }

      return going;

    case CANCEL_GOING_TO_EVENT:
      let cancel = [...state];

      if (cancel[0] && cancel[0].attendees) {
        delete cancel[0]["attendees"][payload.uid];
      }

      return cancel;

    default:
      return [...state];
  }
};
