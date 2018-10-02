import moment from "moment";
import firebase from "../../app/config/firebase";
import { createNewEvent } from "../../app/common/util/helpers";
export const FETCH_EVENTS = "FETCH_EVENTS";
export const CREATE_EVENT = "CREATE_EVENT";
export const UPDATE_EVENT = "UPDATE_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";

export const createEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const newEvent = createNewEvent(user, photoURL, event);

  try {
    const createEvent = await firestore.add("events", newEvent);
  } catch (err) {}
};

export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState
) => {};
