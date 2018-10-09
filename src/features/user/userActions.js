import moment from "moment";
import firebase from "../../app/config/firebase";
import { toastr } from "react-redux-toastr";
import {
  asyncActionError,
  asyncActionStart,
  asyncActionFinish
} from "../async/asyncActions";
// Types
import { FETCH_EVENTS } from "../events/eventActions";

export const goingToEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  dispatch(asyncActionStart());
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;

  const attendee = {
    going: true,
    joinDate: Date.now(),
    photoURL: user.photoURL || "/assets/user.png",
    displayName: user.displayName,
    host: false
  };

  try {
    const eventDocRef = firestore.collection("events").doc(event.id);
    const eventAttendeeDocRef = firestore
      .collection("event_attendee")
      .doc(`${event.id}_${user.uid}`);

    await firestore.runTransaction(async transaction => {
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      });
      await transaction.set(eventAttendeeDocRef, {
        eventId: event.id,
        userUid: user.uid,
        eventDate: event.date,
        host: false
      });
    });
    dispatch(asyncActionFinish());
    toastr.success("Success", "You have signed up to the event");
  } catch (err) {
    console.log(err);
    dispatch(asyncActionError());
    toastr.error("Oops", "Problem signing up to event");
  }
};

export const cancelGoingToEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const user = firebase.auth().currentUser;
  const firestore = getFirestore();

  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success("Success", "You have removed yourself from the event");
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "something went wrong");
  }
};

export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("event_attendee");
  const today = new Date(Date.now());

  let query;

  // console.log('userUid', userUid);

  switch (activeTab) {
    case 1: // past events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", "<=", today)
        .orderBy("eventDate", "desc");
      break;
    case 2: // future events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", ">=", today)
        .orderBy("eventDate");
      break;
    case 3: // hosted events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("host", "==", true)
        .orderBy("eventDate", "desc");
      break;
    default:
      query = eventsRef
        .where("userUid", "==", userUid)
        .orderBy("eventDate", "desc");
  }

  try {
    const querySnap = await query.get();
    const events = [];

    for (let i = 0; i < querySnap.docs.length; i++) {
      const evt = await firestore
        .collection("events")
        .doc(querySnap.docs[i].data().eventId)
        .get();

      events.push({ ...evt.data(), id: evt.id });
    }

    console.log("events", events);

    dispatch({ type: FETCH_EVENTS, payload: { events } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  // we do not want to save isLoaded || isEmpty
  const { isLoaded, isEmpty, ...updatedUser } = user;

  if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
  }

  try {
    await firebase.updateProfile(updatedUser);
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};
