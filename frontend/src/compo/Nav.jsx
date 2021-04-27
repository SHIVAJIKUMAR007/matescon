import React, { useEffect, useState } from "react";
import "../style/nav.css";
import { NavLink, useHistory } from "react-router-dom";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import CloseIcon from "@material-ui/icons/Close";
import HorizontalSplitOutlinedIcon from "@material-ui/icons/HorizontalSplitOutlined";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved, logout } from "../action";
import {
  newNotificationInNotiPage,
  newNotificationElse,
} from "../action/notification";
import { Avatar } from "@material-ui/core";
import { notifiSocket, profilePic, quansService } from "../axios";
import { toast } from "react-toastify";
import io from "socket.io-client";

function Nav() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  const Logout = () => {
    var confi = window.confirm("Are you sure to logout?");
    if (confi) {
      dispatch(logout());
      history.push("/");
    }
  };

  return (
    <>
      <input type="checkbox" name="check" id="check" />
      <nav>
        <div className="icon">
          <NavLink to="/">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Matescon"
              className=" img-fluid"
            />
          </NavLink>
        </div>

        {user ? (
          <div className="searchBox">
            <input type="search" name="search" placeholder="Search" />
            <SearchOutlinedIcon className="searchIcon" />
          </div>
        ) : null}

        <ul>
          {user ? (
            // if user is logged in
            <>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/chat">Chat</NavLink>
              </li>
              <li>
                <div>
                  Ask-Quetion
                  <div className="dropdown1">
                    <ul>
                      <li>
                        {/* <!-- Button trigger modal --> */}
                        <div
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                        >
                          Ask New Quetion
                        </div>
                      </li>
                      {user?.collageStatus !== "aspirant" ? (
                        <li>
                          <NavLink to="/youSouldAns">You Sould Answer</NavLink>
                        </li>
                      ) : null}

                      <li>
                        <NavLink to="/all/quetion"> My All Quetions </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <NotifyOption user={user} />
              <li>
                <div id="profileNavOption">
                  <Avatar
                    src={`${profilePic}${user?.profilePic}`}
                    id="avatar"
                  />
                  <center>
                    <p style={{ fontSize: "0.7rem", marginTop: "0.3rem" }}>
                      {user.username}
                    </p>
                  </center>
                  <div className="dropdown1">
                    <ul>
                      <li>
                        <NavLink to="/profile"> Hey {user?.name}!!! </NavLink>
                      </li>
                      <li>
                        <NavLink to="/editProfile"> Edit Profile </NavLink>
                      </li>
                      <li>
                        <NavLink onClick={Logout} to="/">
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </>
          ) : (
            // if user is not logged in
            <>
              <li style={{ margin: "0 1rem" }}>
                <NavLink to="/">Home</NavLink>
              </li>
              <li style={{ margin: "0 1rem" }}>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li style={{ margin: "0 1rem" }}>
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
            </>
          )}
        </ul>

        <label htmlFor="check" className="bar">
          <HorizontalSplitOutlinedIcon className="bars" />
          <CloseIcon className="close" />
        </label>
      </nav>

      <Modal user={user} />
    </>
  );
}

function NotifyOption({ user }) {
  // console.log(window.location.pathname);
  const dispatch = useDispatch();
  const notify = useSelector((state) => state.notify);

  useEffect(() => {
    // function to dispatch new notification
    function updateNotifyState(newNotify) {
      window.location.pathname === "/notification"
        ? dispatch(newNotificationInNotiPage(newNotify))
        : dispatch(newNotificationElse(newNotify));
    }
    const socket = io(notifiSocket);
    socket.on("connection");
    //send uid and get notification till now
    socket.emit("getNotifictions", { uid: user?._id });
    // // get notification and dispatch it to notify reducer
    // socket.on("sendNotification", ({ notifications }) => {
    //   dispatch(setNotifications(notifications));
    // });
    //listenling diffrent event for new notification
    socket.on("newNotificationAdded", ({ newNotification }) => {
      updateNotifyState(newNotification);
    });
    socket.on("newPostNotificationAdded", ({ newNotification }) => {
      updateNotifyState(newNotification);
    });
    socket.on("newQuansNotificationAdded", ({ newNotification }) => {
      updateNotifyState(newNotification);
    });

    return () => {
      socket.off();
    };
  }, [dispatch, user]);

  return (
    <li>
      <NavLink to="/notification" style={{ position: "relative" }}>
        Notification
        {notify.newCount ? (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              borderRadius: "50%",
              backgroundColor: "hsl(168°, 25%, 80%)",
              color: "black",
              margin: "0.5rem",
            }}
          >
            {notify.newCount}
          </span>
        ) : null}
      </NavLink>
    </li>
  );
}

const Modal = ({ user }) => {
  const [que, setque] = useState({
    que: "",
    collageTag: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setque((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      que: que?.que,
      tag: que?.tag,
      askerId: user?._id,
      askerName: user?.name,
      askerPic: user?.profilePic,
    };
    let postQue = await quansService.post("/askQuetion", dataToSend);
    postQue = await postQue.data;

    if (postQue.msg === "ok") {
      toast.success(postQue.result, { position: "top-center" });
    } else {
      toast.error("Server is down, please come again after some time.");
    }
  };

  return (
    <>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Ask-Quetion
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="que">
                  Quetion <span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  name="que"
                  id="que"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
                <br />

                <label htmlFor="tag">
                  Collages Tag <span className="text-danger">*</span>{" "}
                  <span style={{ fontSize: "0.7rem" }}>
                    (collages name to which this quetion is ralated.)
                  </span>{" "}
                </label>
                <input
                  type="text"
                  name="tag"
                  id="tag"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  data-dismiss="modal"
                >
                  Submit Quetion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
