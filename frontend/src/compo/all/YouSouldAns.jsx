import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService, profilePic, quansService } from "../../axios";
import { isUserSaved } from "../../action";
import { NavLink } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
import More from "../More";

function YouSouldAns() {
  const [que, setque] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer);
  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      const allque = await (
        await quansService.get(
          `/quetionToAns/${user?._id}/${user?.collageShort}`
        )
      ).data;
      setque(allque);
    };
    fetchData();
  }, [user]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-3 col-12"></div>
          {/* main work is here  */}
          <div className="col-lg-4 col-md-6 col-12 ">
            {que?.map((que, i) => (
              <Que key={i} que={que} user={user} />
            ))}
          </div>

          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>
    </>
  );
}

const Que = ({ que, user }) => {
  const [asker, setasker] = useState({});
  const [showMoreOptions, setshowMoreOptions] = useState(false);
  useEffect(() => {
    async function fetchData() {
      let askerData = await (await authService.get(`/user/${que?.askerId}`))
        .data;
      setasker(askerData);
    }
    fetchData();
  }, [que]);
  return (
    <div className="quetion">
      <div className="queHeader m-2 row">
        <div className="avatarDiv mt-1">
          <Avatar className="avatar" src={profilePic + que?.askerPic} />
        </div>
        <div className="aboutCreator ml-2">
          <span className="creatorName">{que?.askerName}</span>
          <p>
            {asker?.collageShort}
            {asker?.collageStatus === "alumuni" ? <span>Alumuni</span> : null}
          </p>
        </div>
        <div className="mt-3 ml-auto position-relative">
          <MoreVertIcon
            onClick={() => setshowMoreOptions((pre) => (pre ? false : true))}
          />
          {showMoreOptions ? (
            <More user={user} doer={asker} content={que} type="que" />
          ) : null}
        </div>
      </div>
      <div className="queBody">
        <NavLink to={`/que/${que?._id}`}>
          <b>{que?.que}</b>
        </NavLink>
      </div>

      <div className="queFooter">
        <NavLink to={`/que/${que?._id}`}>
          <div className="answers">
            <img
              src={process.env.PUBLIC_URL + "/answer.png"}
              alt="answer"
              className="img-fluid"
            />
            <span>{que?.ansNum}</span>
          </div>
        </NavLink>
        <div className="share ml-auto">
          <ShareIcon />
        </div>
      </div>
    </div>
  );
};

export default YouSouldAns;
