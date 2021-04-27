import React, { useEffect, useLayoutEffect, useState } from "react";
import "../style/chatAll.css";
import { useSelector, useDispatch } from "react-redux";
import { isUserSaved } from "../action";
import { Avatar } from "@material-ui/core";
import io from "socket.io-client";
import { massageSocket, profilePic, authService } from "../axios";
import { timeToAgo } from "../someImpFun";
import { NavLink } from "react-router-dom";
function ChatAll() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [rooms, setrooms] = useState([]);

  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("getRooms", { uid: user?._id });
    socket.on("getAllRooms", ({ rooms }) => setrooms(rooms));
    //updating new room created in real time
    socket.on("newRoomAdded", ({ newRoom }) => {
      setrooms((pre) => {
        return [newRoom, ...pre];
      });
    });

    return () => {
      socket.off();
    };
  }, [user]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="main col-lg-6 col-md-10 col-12 ">
            <h3 className="my-2">Chat</h3>

            <div className="allRooms">
              {rooms?.map((room, i) => (
                <OneRoom key={i} user={user} room={room} setRooms={setrooms} />
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
    </>
  );
}

const OneRoom = ({ user, room, setRooms }) => {
  const [secondPerson, setsecondPerson] = useState({});
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
  }, [room, user]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("joinChatRoom", { roomId: room?._id });
    // updating lastmassage in realtime
    socket.on("lastMassageUpdated", ({ lastMassage, lastMassageTime }) => {
      setRooms((pre) => {
        const res = pre.find((x) => x._id === room._id);
        res.lastMassage = lastMassage;
        res.lastMassageTime = lastMassageTime;
        pre.sort((a, b) => {
          return Date.parse(b.lastMassgeTime) - Date.parse(a.lastMassgeTime);
        });
        return pre;
      });
      setRooms((pre) => {
        return [...pre, { forsswork: true }];
      });
      setRooms((pre) => {
        return pre.slice(0, pre.length - 1);
      });
    });
    return () => {
      socket.off();
    };
  }, [room, setRooms]);
  return (
    <>
      <NavLink to={`/chat/${room?._id}`}>
        <div className="oneRoom">
          <Avatar src={profilePic + secondPerson?.profilePic} />
          <div className="roomDetails">
            <h6>{secondPerson?.name}</h6>
            <p>{room?.lastMassage ? room?.lastMassage : null}</p>
            <p>
              {room?.lastMassage
                ? timeToAgo(Date.parse(room?.lastMassageTime))
                : null}
            </p>
          </div>
        </div>
      </NavLink>
    </>
  );
};
export default ChatAll;
