import React, { useEffect, useLayoutEffect, useState } from "react";
import "../style/notification.css";
import { Avatar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { isUserSaved } from "../action";
import { setNotificationsAsSeen } from "../action/notification";
import io from "socket.io-client";
import { ffService, notifiSocket, profilePic } from "../axios";
import { timeToAgo } from "../someImpFun";
import { NavLink } from "react-router-dom";
import { targetUrl } from "../someJson";

function Notification() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer);
  const notify = useSelector((state) => state.notify);
  const [notificationToShow, setnotificationToShow] = useState([]);
  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(notifiSocket);
    socket.on("connection");
    //send uid and get notification till now
    socket.emit("getNotifictions", { uid: user?._id });
    // get notification and dispatch it to notify reducer
    socket.on("sendNotification", ({ notifications }) => {
      dispatch(setNotificationsAsSeen(notifications));
      setnotificationToShow(notify.preNotifications);
    });

    return () => {
      socket.off();
    };
  }, [user, dispatch,notify]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="main col-lg-6 col-md-10 col-12 ">
            <h2>Notification</h2>

            <div className="allNotification">
              {notificationToShow?.map((notifi, i) => (
                <GetNoti key={i} note={notifi} value={i} />
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
    </>
  );
}

const GetNoti = ({ note, value }) => {
  return (
    <NavLink to={targetUrl[note.type] + note.targetId}>
      {note.type === "increaseFollowing" ? (
        <OneNotificationStartFollowing note={note} value={value} />
      ) : (
        <OneNotification note={note} value={value} />
      )}
    </NavLink>
  );
};

const OneNotification = ({ note, value }) => {
  useEffect(() => {
    const text = document.getElementById("notificationText" + value);
    text.innerHTML = note.notificationText;
  }, [value, note]);
  return (
    <>
      <div className="oneNotification">
        <Avatar src={profilePic + note?.doerPic} />
        <div className="notificationDetail">
          <p id={"notificationText" + value}></p>
          <p className="time">{timeToAgo(Date.parse(note?.time))}</p>
        </div>
      </div>
    </>
  );
};

const OneNotificationStartFollowing = ({ note, value }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer);
  const [following, setfollowing] = useState(0);

  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      // is user already following him
      const ffData = await (
        await ffService.get(`/isFollowing/${user?._id}/${note?.doerId}`)
      ).data;
      setfollowing(ffData.result);
    };
    fetchData();
  }, [note, user]);
  useEffect(() => {
    const text = document.getElementById("notificationText" + value);
    text.innerHTML = note.notificationText;
  }, [value, note]);
  const startFollow = async () => {
    let startFollow = await ffService.post("/newFollower", {
      followerId: user?._id,
      followeeId: note?.doerId,
    });

    startFollow = startFollow.data;
    if (startFollow.msg === "ok") {
      setfollowing(1);
    }
  };
  const unfollow = async () => {
    let unfollow = await ffService.post("/unfollow", {
      followerId: user?._id,
      followeeId: note?.doerId,
    });

    unfollow = unfollow.data;
    if (unfollow.msg === "ok") {
      setfollowing(0);
    }
  };

  return (
    <>
      <div className="oneNotification">
        <Avatar src={profilePic + note?.doerPic} />
        <div className="notificationDetail">
          <p></p>
          <p className="time">{timeToAgo(Date.parse(note?.time))}</p>
        </div>

        <div className="startFollowing">
          {/* isFollowing == 0  */}{" "}
          <button className="btn" onClick={following ? unfollow : startFollow}>
            {following ? "following" : "follow"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Notification;
