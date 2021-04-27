export const notifyReducer = (
  state = { preNotifications: [], newCount: 0, newNotifications: [] },
  action
) => {
  switch (action.type) {
    case "NEW_NOTIFICATION_IN_NOTI_PAGE":
      state.preNotifications.append(action.payload);
      return state;

    case "NEW_NOTIFICATION_ELSE":
      state.newCount += 1;
      state.newNotifications.append(action.payload);
      return state;

    case "SET_NOTIFICATIONS":
      state.preNotifications = action.payload;
      return state;

    case "SET_NOTIFICATIONS_AS_SEEN":
      state.preNotifications = action.payload;
      state.newCount = 0;
      state.newNotifications = [];
      return state;
    default:
      return state;
  }
};
