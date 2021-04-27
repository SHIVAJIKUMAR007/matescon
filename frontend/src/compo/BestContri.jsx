import React, { useEffect, useState } from "react";
import "../style/sidebar.css";
import { Avatar } from "@material-ui/core";
import { authService, profilePic } from "../axios";
import { NavLink } from "react-router-dom";
function BestContri() {
  const [contributors, setcontributors] = useState([]);

  useEffect(() => {
    async function getData() {
      const contri = await (await authService.get(`/best/betContributors`))
        .data;

      setcontributors(contri);
    }
    getData();
  }, []);
  return (
    <>
      <div className="bestContriDiv">
        <h5 className="m-2">Best Contributor</h5>
        {contributors?.map((contri, i) => (
          <Contri key={i} contri={contri} />
        ))}
      </div>
    </>
  );
}

function Contri({ contri }) {
  return (
    <>
      <div className="contributor ">
        <NavLink to={`/profile/${contri?._id}`}>
          <div className="avatarDiv mt-1">
            <Avatar className="avatar" src={profilePic + contri?.profilePic} />
          </div>
          <div className="aboutCreator ml-2">
            <span className="creatorName">{contri?.name}</span>
            <p>
              {contri?.collageShort}{" "}
              <span>
                {contri?.collageStatus === "alumuni" ? `Alumuni` : null}
              </span>
            </p>
          </div>
        </NavLink>
        <div className="mt-3 ml-auto">{contri?.creditScore}</div>
      </div>
    </>
  );
}

export default BestContri;
