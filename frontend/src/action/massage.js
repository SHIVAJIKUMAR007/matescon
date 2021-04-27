export const getMassage = (massage) => {
  return {
    type: "GET_ROOM_MASSAGES",
    payload: massage,
  };
};

export const sendMassageToRoom = (massage) => {
  return {
    type: "SEND_NEW_MASSAGE",
    payload: massage,
  };
};
