import moment from "moment";

export const createNewEvent = (user, photoURL, event) => {
  event.date = moment(event.date).toDate();
  return {
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: photoURL || "/assets/user.png",
    created: Date.now()
  };
};

export const objectToArray = obj => {
  if (obj)
    return Object.entries(obj).map(entry =>
      Object.assign(entry[1], { id: entry[0] })
    );
};
