import React, { useEffect, useState } from "react";
import "../style/profile.css";
import Post from "./Post";
import { Avatar } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import {
  authService,
  ffService,
  postService,
  profilePic,
  quansService,
  massageSocket,
} from "../axios";
import { toast, ToastContainer } from "react-toastify";
import { Ans } from "./Quans";
import io from "socket.io-client";
function Profile() {
  const [postOrQuans, setpostOrQuans] = useState(0);
  const [countData, setcountData] = useState({});
  const userData = JSON.parse(
    window.localStorage.getItem("@*hdfTO%Z(jdk)%/user")
  );

  useEffect(() => {
    const user = JSON.parse(
      window.localStorage.getItem("@*hdfTO%Z(jdk)%/user")
    );
    const fetchData = async () => {
      //get count data
      const count = await (await authService.get("/countData/" + user?._id))
        .data;
      setcountData(count);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="mainProfileDiv col-lg-6 col-md-10 col-12 ">
            <div className="profileCenterDiv">
              <div className="profileHeader">
                <div className="avtarAnddetails">
                  <Avatar
                    src={`${profilePic}${userData?.profilePic}`}
                    className="avatar"
                  />
                  <div className="profileStats">
                    <div className="followAndFollowing">
                      <p className="dataAndDetail">
                        <span className="data">{countData?.followers}</span>
                        <span className="detail">Followers</span>
                      </p>
                      <p className="dataAndDetail">
                        <span className="data">{countData?.following}</span>
                        <span className="detail">Following</span>
                      </p>
                    </div>
                    <div className="postQueAns">
                      <p className="dataAndDetail">
                        <span className="data">{countData?.postNum}</span>
                        <span className="detail">Posts</span>
                      </p>
                      <p className="dataAndDetail">
                        <span className="data">{countData?.queNum}</span>
                        <span className="detail">Quetions</span>
                      </p>
                      {userData?.collageStatus !== "aspirant" ? (
                        <p className="dataAndDetail">
                          <span className="data">{countData?.ansNum}</span>
                          <span className="detail">Contibutions</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="personalDetails">
                  <span className="usersName">{userData?.name}</span>
                  <br />
                  <span className="usersUsername">@{userData?.username}</span>
                  <br />
                  <span className="collage">
                    {userData?.collageShort}{" "}
                    {userData?.collageStatus === "alumuni" ? `Alumuni` : null}
                  </span>
                  <br />
                  <span className="usersBio">{userData?.bio}</span>
                </div>
              </div>

              <div className="postAndAns">
                {userData?.collageStatus === "aspirant" ? (
                  <>
                    <div className="col-lg-12 col-12 " id="profilePostBtn">
                      Posts
                    </div>
                    <Posts id={userData?._id} />
                  </>
                ) : (
                  <>
                    <div className="row ">
                      <div
                        className="col-lg-6 col-6 active"
                        id="profileContriBtn"
                        onClick={() => {
                          setpostOrQuans(0);
                          document
                            .querySelector("#profilePostBtn")
                            .classList.remove("active");
                          document
                            .querySelector("#profileContriBtn")
                            .classList.add("active");
                        }}
                      >
                        Contributions
                      </div>
                      <div
                        className="col-lg-6 col-6 "
                        id="profilePostBtn"
                        onClick={() => {
                          setpostOrQuans(1);
                          document
                            .querySelector("#profileContriBtn")
                            .classList.remove("active");
                          document
                            .querySelector("#profilePostBtn")
                            .classList.add("active");
                        }}
                      >
                        Posts
                      </div>
                    </div>
                    {postOrQuans ? (
                      <Posts id={userData?._id} />
                    ) : (
                      <Contiries id={userData?._id} />
                    )}{" "}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

function OtherProfile() {
  const [postOrQuans, setpostOrQuans] = useState(0);
  const [profileOwner, setprofileOwner] = useState({});
  const [following, setfollowing] = useState(0);
  const [countData, setcountData] = useState({});
  const { id } = useParams();
  const history = useHistory();
  const userData = JSON.parse(
    window.localStorage.getItem("@*hdfTO%Z(jdk)%/user")
  );

  useEffect(() => {
    const user = JSON.parse(
      window.localStorage.getItem("@*hdfTO%Z(jdk)%/user")
    );
    const fetchData = async () => {
      //get data of profile owener
      const data = await (await authService.get("/user/" + id)).data;
      setprofileOwner(data);
      //get count data
      const count = await (await authService.get("/countData/" + id)).data;
      setcountData(count);
      // is user already following him
      const ffData = await (
        await ffService.get(`/isFollowing/${user?._id}/${id}`)
      ).data;
      setfollowing(ffData.result);
    };
    fetchData();
  }, [id]);

  const startFollow = async () => {
    let startFollow = await ffService.post("/newFollower", {
      followerId: userData?._id,
      followeeId: id,
    });

    startFollow = startFollow.data;
    if (startFollow.msg === "ok") {
      toast.success("you started following " + profileOwner?.name, {
        position: "top-center",
      });
      setfollowing(1);
    }
  };

  const unfollow = async () => {
    let unfollow = await ffService.post("/unfollow", {
      followerId: userData?._id,
      followeeId: id,
    });

    unfollow = unfollow.data;
    if (unfollow.msg === "ok") {
      toast.warn(unfollow.result, {
        position: "top-center",
      });
      setfollowing(0);
    }
  };

  const goToChatRoom = async () => {
    const socket = io(massageSocket);
    socket.on("connection");

    socket.emit("getRoomId", {
      userId: userData?._id,
      otherId: profileOwner?._id,
    });
    socket.on("roomPresent", ({ roomId }) => {
      console.log(roomId);
      history.push(`/chat/${roomId}`);
      socket.off();
    });
  };
  return (
    <>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="mainProfileDiv col-lg-6 col-md-10 col-12 ">
            <div className="profileCenterDiv">
              <div className="profileHeader">
                <div className="avtarAnddetails">
                  <Avatar
                    src={`${profilePic}${profileOwner?.profilePic}`}
                    className="avatar"
                  />
                  <div className="profileStats">
                    <div className="followAndFollowing">
                      <p className="dataAndDetail">
                        <span className="data">{countData?.followers}</span>
                        <span className="detail">Followers</span>
                      </p>
                      <p className="dataAndDetail">
                        <span className="data">{countData?.following}</span>
                        <span className="detail">Following</span>
                      </p>
                    </div>
                    <div className="postQueAns">
                      <p className="dataAndDetail">
                        <span className="data">{countData?.postNum}</span>
                        <span className="detail">Posts</span>
                      </p>
                      <p className="dataAndDetail">
                        <span className="data">{countData?.queNum}</span>
                        <span className="detail">Quetions</span>
                      </p>
                      {profileOwner?.collageStatus !== "aspirant" ? (
                        <p className="dataAndDetail">
                          <span className="data">{countData?.ansNum}</span>
                          <span className="detail">Contibutions</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="personalDetails">
                  <span className="usersName">{profileOwner?.name}</span>
                  <br />
                  <span className="usersUsername">
                    @{profileOwner?.username}
                  </span>
                  <br />
                  <span className="collage">
                    {profileOwner?.collageShort}{" "}
                    {profileOwner?.collageStatus === "alumuni"
                      ? `Alumuni`
                      : null}
                  </span>
                  <br />
                  <span className="usersBio">{profileOwner?.bio}</span>
                </div>
              </div>

              {userData?._id !== id ? (
                <div className="profileOwner row">
                  {following ? (
                    <>
                      <div className="following" onClick={unfollow}>
                        Following{" "}
                      </div>
                      <div className="dm" onClick={goToChatRoom}>
                        Massage
                      </div>
                    </>
                  ) : (
                    <div className="follow" onClick={startFollow}>
                      Follow
                    </div>
                  )}
                </div>
              ) : null}

              <div className="postAndAns">
                {profileOwner?.collageStatus === "aspirant" ? (
                  <>
                    <div className="col-lg-12 col-12" id="profilePostBtn">
                      Posts
                    </div>
                    <Posts id={profileOwner?._id} />
                  </>
                ) : (
                  <>
                    <div className="row ">
                      <div
                        className="col-lg-6 col-6 active"
                        id="profileContriBtn"
                        onClick={() => {
                          setpostOrQuans(0);
                          document
                            .querySelector("#profilePostBtn")
                            .classList.remove("active");
                          document
                            .querySelector("#profileContriBtn")
                            .classList.add("active");
                        }}
                      >
                        Contributions
                      </div>
                      <div
                        className="col-lg-6 col-6 "
                        id="profilePostBtn"
                        onClick={() => {
                          setpostOrQuans(1);
                          document
                            .querySelector("#profileContriBtn")
                            .classList.remove("active");
                          document
                            .querySelector("#profilePostBtn")
                            .classList.add("active");
                        }}
                      >
                        Posts
                      </div>
                    </div>
                    {postOrQuans ? (
                      <Posts id={profileOwner?._id} />
                    ) : (
                      <Contiries id={profileOwner?._id} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

const Posts = ({ id }) => {
  const [posts, setposts] = useState([]);
  const [isLoading, setisLoading] = useState({
    state: true,
    data: "Loading......",
  });
  useEffect(() => {
    const fetchData = async () => {
      const postData = await (await postService.get(`/allPost/${id}`)).data;
      setposts(postData);
      if (postData.length) {
        setisLoading({ state: false, data: "fetched" });
      } else {
        setisLoading({ state: true, data: "No Post Yet" });
      }
    };
    fetchData();
  }, [id]);
  return (
    <>
      <div className="posts">
        {/* onePost */}
        {/* {posts.length ? null : (
          <h3 className="mt-5 text-center">No Post Yet.</h3>
        )} */}
        {isLoading.state ? (
          <h3 className="mt-5 text-center">{isLoading.data}</h3>
        ) : null}
        {posts.map((post, i) => (
          <Post key={i} postData={post} />
        ))}
      </div>
    </>
  );
};

const Contiries = ({ id }) => {
  const [ans, setans] = useState([]);
  const [isLoading, setisLoading] = useState({
    state: true,
    data: "Loading......",
  });
  useEffect(() => {
    const fetchData = async () => {
      const ansData = await (await quansService.get(`ans/allAnswers/${id}`))
        .data;
      if (ansData.length) {
        setans(ansData);
        setisLoading({ state: false, data: "fetched" });
      } else {
        setisLoading({ state: true, data: "No Contributions Yet" });
      }
    };
    fetchData();
  }, [id]);
  return (
    <>
      <div className="contries ">
        {/* oneContri */}
        {isLoading.state ? (
          <h3 className="mt-5 text-center">{isLoading.data}</h3>
        ) : null}
        {ans.map((ans, i) => (
          <Ans key={i} ans1={ans} type="feed" />
        ))}
      </div>
    </>
  );
};

export default Profile;
export { OtherProfile };
