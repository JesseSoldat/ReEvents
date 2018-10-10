import moment from "moment";
import firebase from "../../app/config/firebase";
import { toastr } from "react-redux-toastr";
import cuid from "cuid";
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
  { getFirestore, getFirebase }
) => {
  dispatch(asyncActionStart());
  const firestore = getFirestore();
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  const attendee = {
    going: true,
    joinDate: Date.now(),
    photoURL: profile.photoURL || "/assets/user.png",
    displayName: profile.displayName,
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
  { getFirestore, getFirebase }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;

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

  console.log("updatedUser", updatedUser);

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

export const uploadProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    // upload the file to fb storage
    const uploadedFile = await firebase.uploadFile(path, file, null, options);

    // get url of image
    const downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
    // console.log("downloadURL", downloadURL);

    // get the user doc from firestore
    const userDoc = await firestore.get(`users/${user.uid}`);
    // console.log("userDoc", userDoc);

    // check if user has photo, if not update profile
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      console.log("Firestore updateProfile#1");

      await user.updateProfile({
        photoURL: downloadURL
      });
      console.log("Firebase updateProfile#2");
    }
    // add the new photo to photos collection
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "photos" }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem uploading photo");
  }
};

export const setMainPhoto = photo => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  dispatch(asyncActionStart());
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  const today = new Date(Date.now());

  const userDocRef = firestore.collection("users").doc(user.uid);
  const eventAttendeeRef = firestore.collection("event_attendee");

  try {
    const batch = firestore.batch();

    await batch.update(userDocRef, {
      photoURL: photo.url
    });

    const eventQuery = await eventAttendeeRef
      .where("userUid", "==", user.uid)
      .where("eventDate", ">", today);

    const eventQuerySnap = await eventQuery.get();

    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      const eventDocRef = await firestore
        .collection("events")
        .doc(eventQuerySnap.docs[i].data().eventId);

      const event = await eventDocRef.get();

      // Check if current user is the host
      if (event.data().hostUid === user.uid) {
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      }
      // Update photo for attendee with current user photo
      else {
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      }
    }

    await batch.commit();
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem setting main photo");
  }
};

export const deletePhoto = photo => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "photos", doc: photo.id }]
    });
  } catch (error) {
    console.log(error);
    throw new Error("Problem deleting the photo");
  }
};
