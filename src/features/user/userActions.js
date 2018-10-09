import moment from "moment";
import firebase from "../../app/config/firebase";
import { toastr } from "react-redux-toastr";
import cuid from "cuid";
import {
  asyncActionError,
  asyncActionStart,
  asyncActionFinish
} from "../async/asyncActions";

export const goingToEvent = event => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
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

export const cancelGoingToEvent = event => async (dispatch, getState) => {};
