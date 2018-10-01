import { SubmissionError, reset } from "redux-form";
// Actions
import { closeModal } from "../modals/modalActions";
// Types
export const LOGIN_USER = "LOGIN_USER";
export const SIGN_OUT_USER = "SIGN_OUT_USER";

export const login = creds => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();

  try {
    await firebase
      .auth()
      .signInWithEmailAndPassword(creds.email, creds.password);
    dispatch(closeModal());
  } catch (err) {
    console.log(err);
    throw new SubmissionError({
      _error: err.message
    });
  }
};

export const registerUser = user => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  try {
    // create the user in firebase auth
    const createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password);

    await createdUser.user.updateProfile({
      displayName: user.displayName
    });

    // create a new profile in firestore
    const newUser = {
      displayName: user.displayName,
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    await firestore.set(`users/${createdUser.user.uid}`, { ...newUser });
    dispatch(closeModal());
  } catch (err) {
    console.log(err);
    throw new SubmissionError({
      _error: err.message
    });
  }
};
