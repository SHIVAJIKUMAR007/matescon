import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { notifiSocket } from "../axios";
function Testing() {
  const [data, setdata] = useState("");
  const click = () => {
    var confi = window.confirm("Are you Sure ?");
    if (confi) {
      console.log("yes");
    } else {
      console.log("no");
    }
  };

  // useEffect(() => {
  //   const socket = socketIOClient(notifiSocket);

  //   const x = {
  //     notifierId: "6071b19718fa3c253c09907b",
  //     targetId: "dkjfhskdfiusdfj wf w f",
  //     type: "like on post",
  //     notificationText: "some one like your post",
  //     time: Date.now(),
  //   };
  //   socket.on("connection");
  //   socket.emit("postNotification", x);

  //   socket.on("postNotificationResult", ({ msg }) => {
  //     console.log(msg);
  //   });
  //   return () => {
  //     socket.on("disconnect", () => {
  //       console.log("user disconnect");
  //     });
  //   };
  // }, []);

  return <div onClick={click}>testing</div>;
}

export default Testing;
