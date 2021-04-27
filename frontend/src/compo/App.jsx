import React, { useEffect } from "react";
import "../style/app.css";
import "../style/bootstrap.min.css";
import Nav from "./Nav";
import Home from "./Home";
import ChatAll from "./ChatAll";
import Notification from "./Notification";
import Profile, { OtherProfile } from "./Profile";
import SignUp, { AlmostDone } from "./SignUp";
import Login from "./Login";
import { Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import Error404 from "./Error404";
import Chat from "./Chat";
import EditProfile from "./EditProfile";
import OnePost from "./one/OnePost";
import OneQue from "./one/OneQue";
import OneAns from "./one/OneAns";
import Testing from "./Testing";
import AllQue from "./all/AllQue";
import CommentP, { ReplyP, ReplyQ, CommentQ } from "./one/CommentP";
import YouSouldAns from "./all/YouSouldAns";
//toast
import { ToastContainer } from "react-toastify";

function App() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  return (
    <>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          {user ? (
            () => {
              history.push("/");
            }
          ) : (
            <Login />
          )}
        </Route>
        <Route exact path="/signup">
          {user ? (
            () => {
              history.push("/");
            }
          ) : (
            <SignUp />
          )}
        </Route>
        <Route exact path="/almostDone/:collageStatus/:id">
          <AlmostDone />
        </Route>
        <Route exact path="/chat">
          <ChatAll />
        </Route>
        <Route exact path="/chat/:id">
          <Chat />
        </Route>
        <Route exact path="/all/quetion">
          <AllQue />
        </Route>
        <Route exact path="/youSouldAns">
          <YouSouldAns />
        </Route>
        <Route exact path="/notification">
          <Notification />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/editProfile">
          <EditProfile />
        </Route>
        <Route exact path="/profile/:id">
          <OtherProfile />
        </Route>
        <Route exact path="/post/:id">
          <OnePost />
        </Route>
        <Route exact path="/que/:id">
          <OneQue />
        </Route>
        <Route exact path="/ans/:id">
          <OneAns />
        </Route>
        {/* notification result routes */}
        <Route exact path="/commentp/:id">
          <CommentP />
        </Route>
        <Route exact path="/commentq/:id">
          <CommentQ />
        </Route>
        <Route exact path="/replyp/:id">
          <ReplyP />
        </Route>
        <Route exact path="/replyq/:id">
          <ReplyQ />
        </Route>
        <Route exact path="/test">
          <Testing />
        </Route>
        <Route>
          <Error404 />
        </Route>
      </Switch>

      <ToastContainer />
    </>
  );
}

export default App;
