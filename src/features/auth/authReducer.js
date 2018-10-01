import { LOGIN_USER, SIGN_OUT_USER } from "./authActions";

const initialState = {
  currentUser: {}
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        authenticated: true,
        currentUser: payload.creds.email
      };

    default:
      return { ...state };
  }
};
