import { useSelector, useDispatch } from "react-redux";
import { isUserSaved } from "../action";
import { Avatar } from "@material-ui/core";
import io from "socket.io-client";
import { massageSocket, profilePic, authService } from "../axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "../style/chat.css";
import SendIcon from "@material-ui/icons/Send";
import { NavLink, useParams } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { timeToAgo } from "../someImpFun";
function Chat() {
  const [massages, setMassages] = useState([]);
  const [msgToSend, setmsgToSend] = useState("");
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [secondPerson, setsecondPerson] = useState({});
  const [room, setroom] = useState({});

  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("getRoom", { roomId: id });
    socket.on("getRoomResult", ({ room }) => {
      setroom(room);
    });
    socket.emit("getAllchats", { roomId: id });
    socket.on("allMassages", ({ massages }) => setMassages(massages));
    // making it realtime
    socket.on("newMassage", ({ newMassage }) => {
      console.log(newMassage);
      setMassages((pre) => {
        return [...pre, newMassage];
      });
    });
    return () => {
      socket.off();
    };
  }, [id]);
  useEffect(() => {
    if (room._id !== undefined) {
      const otherId =
        room?.partners[0] === user?._id ? room?.partners[1] : room?.partners[0];

      const fetchData = async () => {
        const sencond = await (await authService.get("/user/" + otherId)).data;
        setsecondPerson(sencond);
      };
      fetchData();
    }
  }, [user, room]);

  const sendMassage = (e) => {
    e.preventDefault();
    setmsgToSend("");
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("sendMassage", {
      roomId: id,
      massage: msgToSend,
      senderId: user?._id,
      senderName: user?.name,
    });
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="main col-lg-6 col-md-10 col-12 ">
            <h3 className="my-2">
              <span id="backBtn">
                <NavLink to="/chat">
                  <ArrowBackIcon />
                </NavLink>
              </span>
              Chat
            </h3>

            <div className="room">
              <div className="header">
                <Avatar src={profilePic + secondPerson?.profilePic} />
                <div className="secPersonName">{secondPerson?.name}</div>
              </div>
              <div className="body">
                {massages?.map((massage, i) => (
                  <Msg
                    key={i}
                    msg={massage}
                    secondPerson={massage?.senderId !== user?._id}
                  />
                ))}
              </div>
              <div className="sender">
                <form onSubmit={sendMassage}>
                  <input
                    type="text"
                    name="msg"
                    id="msg"
                    value={msgToSend}
                    onChange={(e) => setmsgToSend(e.target.value)}
                    placeholder="Type a massage"
                  />
                  <button className="btn" type="submit">
                    <SendIcon />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
    </>
  );
}

function Msg({ secondPerson, msg }) {
  return (
    <>
      <div className={secondPerson ? "secondPerson" : "me"}>
        <div className="msg">{msg.massage}</div>
        <div className="time">{timeToAgo(Date.parse(msg.time))}</div>
      </div>
    </>
  );
}

export default Chat;
