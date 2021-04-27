export const massageReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_ROOM_MASSAGES":
      return (state = action.payload);
    case "SEND_NEW_MASSAGE":
      return (state = action.payload);
    default:
      return state;
  }
};
