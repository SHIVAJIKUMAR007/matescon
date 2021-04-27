export const newNotificationInNotiPage = (newNoti) => {
  return {
    type: "NEW_NOTIFICATION_IN_NOTI_PAGE",
    payload: newNoti,
  };
};

export const newNotificationElse = (newNoti) => {
  return {
    type: "NEW_NOTIFICATION_ELSE",
    payload: newNoti,
  };
};
export const setNotifications = (allNotify) => {
  return {
    type: "SET_NOTIFICATIONS",
    payload: allNotify,
  };
};
export const setNotificationsAsSeen = (allNotify) => {
  return {
    type: "SET_NOTIFICATIONS_AS_SEEN",
    payload: allNotify,
  };
};

