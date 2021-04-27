export const authReducer = (state = null, action) => {
  switch (action.type) {
    case "IS_USER_SAVED":
      const data = window.localStorage.getItem("@*hdfTO%Z(jdk)%/user");
      return (state = JSON.parse(data));
    case "LOGIN":
      window.localStorage.setItem(
        "@*hdfTO%Z(jdk)%/user",
        JSON.stringify(action.payload)
      );
      return (state = action.payload);

    case "LOGOUT":
      window.localStorage.removeItem("@*hdfTO%Z(jdk)%/user");
      return (state = null);

    case "PROFILE_PIC_UPDATE":
      let userData = window.localStorage.getItem("@*hdfTO%Z(jdk)%/user");
      userData = JSON.parse(userData);
      userData.profilePic = action.payload;
      window.localStorage.setItem(
        "@*hdfTO%Z(jdk)%/user",
        JSON.stringify(userData)
      );
      return (state = userData);

    default:
      return state;
  }
};
