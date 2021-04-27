import React, { useEffect, useLayoutEffect, useState } from "react";
import "../style/sidebar.css";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Avatar } from "@material-ui/core";
import { isUserSaved } from "../action";
import { useDispatch, useSelector } from "react-redux";
import { authService, ffService, profilePic } from "../axios";
import { NavLink } from "react-router-dom";
function FollowSugg() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer);
  const [followSugg, setfollowSugg] = useState([]);

  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    async function getData() {
      const sugg = await (
        await authService.get(`/best/followSuggetions/${user?._id}`)
      ).data;

      setfollowSugg(sugg);
    }
    getData();
  }, [user]);
  return (
    <>
      <div className="FollowSuggetionDiv">
        <h5 className="m-2">Follow Suggetion</h5>
        {followSugg?.map((sugg) => (
          <Sugges user={user} sugg={sugg} />
        ))}
      </div>
    </>
  );
}

const Sugges = ({ user, sugg }) => {
  const [following, setfollowing] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // is user already following him
      const ffData = await (
        await ffService.get(`/isFollowing/${user?._id}/${sugg?._id}`)
      ).data;
      setfollowing(ffData.result);
    };
    fetchData();
  }, [sugg, user]);

  const startFollow = async () => {
    let startFollow = await ffService.post("/newFollower", {
      followerId: user?._id,
      followeeId: sugg?._id,
    });

    startFollow = startFollow.data;
    if (startFollow.msg === "ok") {
      setfollowing(1);
    }
  };
  const unfollow = async () => {
    let unfollow = await ffService.post("/unfollow", {
      followerId: user?._id,
      followeeId: sugg?._id,
    });

    unfollow = unfollow.data;
    if (unfollow.msg === "ok") {
      setfollowing(0);
    }
  };

  return (
    <>
      <div className="suggestion ">
        <NavLink to={`/profile/${sugg?._id}`}>
          <div className="avatarDiv mt-1">
            <Avatar className="avatar" src={profilePic + sugg?.profilePic} />
          </div>
          <div className="aboutCreator ml-2">
            <span className="creatorName">{sugg?.name}</span>
            <p>
              {sugg?.collageShort}{" "}
              <span>
                {sugg?.collageStatus === "alumuni" ? `Alumuni` : null}
              </span>
            </p>
          </div>
        </NavLink>
        <div
          className="mt-3 ml-auto"
          onClick={following ? unfollow : startFollow}
        >
          <PersonAddIcon
            style={following ? { color: "#8fbcb3" } : { color: "grey" }}
          />
        </div>
      </div>
    </>
  );
};
export default FollowSugg;
