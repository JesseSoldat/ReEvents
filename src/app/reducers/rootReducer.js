import { combineReducers } from "redux";
// Reducers
import modalsReducer from "../../features/modals/modalReducer";
import eventReducer from "../../features/events/eventReducer";

const rootReducer = combineReducers({
  modals: modalsReducer,
  auth: () => [],
  events: eventReducer
});

export default rootReducer;
