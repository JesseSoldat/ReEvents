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
export const RESET_EVENTS = "RESET_EVENTS";
export const FETCH_EVENT = "FETCH_EVENT";
export const RESET_EVENT = "RESET_EVENT";

export const resetEvents = () => ({
  type: RESET_EVENTS
});

export const createEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const photoURL = getState().firebase.profile.photoURL;
  const user = getState().firebase.auth;
  // console.log("user", user);

  const newEvent = createNewEvent(user, photoURL, event);
  // console.log("newEvent", newEvent);

  try {
    const createdEvent = await firestore.add("events", newEvent);
    // console.log("createdEvent", createdEvent);

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

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? "Are you sure you want to cancel the event?"
    : "This will reactivate the event - are you sure?";
  try {
    toastr.confirm(message, {
      onOk: () =>
        firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState
) => {
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events");

  try {
    dispatch(asyncActionStart());

    let query;
    // console.log("Last Event", lastEvent);

    let startAfter =
      lastEvent &&
      (await firestore
        .collection("events")
        .doc(lastEvent.id)
        .get());

    lastEvent
      ? (query = eventsRef
          .orderBy("date")
          .startAfter(startAfter)
          .limit(3))
      : (query = eventsRef.orderBy("date").limit(3));

    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    const events = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      events.push(evt);
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
  }
};

export const resetEvent = () => ({
  type: RESET_EVENT
});

export const getEvent = eventId => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();

  // console.log("eventId", eventId);

  const eventsRef = firestore.collection("events").doc(eventId);

  try {
    const eventSnapshot = await eventsRef.get();

    const event = eventSnapshot.data();

    const id = eventSnapshot.id;
    // console.log("ID", id);

    event.id = id;
    console.log("getEvent Action", event);

    dispatch({ type: FETCH_EVENT, payload: { event } });
    dispatch(asyncActionFinish());
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
  }
};
