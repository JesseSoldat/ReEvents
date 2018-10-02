import { combineReducers } from "redux";
// 3rd Party
import { reducer as toastrReducer } from "react-redux-toastr";
import { reducer as FormReducer } from "redux-form";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
// Reducers
import asyncReducer from "../../features/async/asyncReducer";
import modalsReducer from "../../features/modals/modalReducer";
import eventReducer from "../../features/events/eventReducer";

const rootReducer = combineReducers({
  form: FormReducer,
  toastr: toastrReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  async: asyncReducer,
  modals: modalsReducer,
  events: eventReducer
});

export default rootReducer;
