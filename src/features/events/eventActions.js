import moment from "moment";
import { toastr } from "react-redux-toastr";
import firebase from "../../app/config/firebase";
// Utils
import { createNewEvent } from "../../app/common/util/helpers";
// Actions
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
// Types
export const FETCH_EVENTS = "FETCH_EVENTS";

export const createEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();

  const user = getState().firebase.auth;
  console.log("user", user);
  const photoURL = user.photoURL;

  const newEvent = createNewEvent(user, photoURL, event);
  console.log("newEvent", newEvent);

  try {
    const createdEvent = await firestore.add("events", newEvent);
    console.log("createdEvent", createdEvent);

    await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
      eventId: createdEvent.id,
      userUid: user.uid,
      eventDate: event.date,
      host: true
    });

    toastr.success("Success", "Event has been created");
  } catch (err) {
    console.log("createEvent", err);
    toastr.error("Oops", "Something went wrong");
  }
};

export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState
) => {
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events");
  const today = new Date(Date.now());
  try {
    dispatch(asyncActionStart());

    let events = await eventsRef.get();

    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
  }
};
