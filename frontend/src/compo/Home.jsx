import React, { useEffect, useState } from "react";
import "../style/home.css";
import { Avatar } from "@material-ui/core";
import BestContri from "./BestContri";
import FollowSugg from "./FollowSugg";
import Post from "./Post";
import { Ans } from "./Quans";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import {
  authService,
  ffService,
  newsFeedService,
  postService,
  profilePic,
  quansService,
} from "../axios";
import ImageIcon from "@material-ui/icons/Image";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Home() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  return <>{user ? <SignedHome user={user} /> : <UnsignedHome />}</>;
}

const UnsignedHome = () => {
  return (
    <>
      <div className="unSignedHome">
        <div className="innerDiv">
          <div className="centerDiv">
            <h1 className=" text-center">Welcome To MatesCon</h1>
            <br />
            <h4 className="text-center">
              Join <NavLink to="/">MatesCon.com</NavLink> and be the part of a
              fantastic <br />
              community, full of helpfull youth.
            </h4>
            <br />
            <div>
              <NavLink to="/signup" className="btn btn-success">
                Join
              </NavLink>
              <NavLink to="/login" className="btn btn-success">
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SignedHome = ({ user }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-1 col-12"></div>
          {/* main work is here  */}
          <div className="main col-lg-8 col-md-10 col-12 ">
            <PostStartButton user={user} />
            <div className="row">
              <div className="postArea col-lg-8 col-md-8 col-12 order-lg-1 order-md-1 order-2 ">
                <FeedArea user={user} />
              </div>
              <div className="sidebar col-lg-4 col-md-4 col-12 order-lg-2 order-md-2 order-1 row">
                <div className="contri col-md-12 col-6">
                  <BestContri />
                </div>
                <div className=" suggesti col-md-12 col-6">
                  <FollowSugg />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-1 col-12"></div>
        </div>
      </div>
    </>
  );
};

const FeedArea = ({ user }) => {
  const [feed, setfeed] = useState([]);
  const [isLoding, setisLoding] = useState({
    state: true,
    data: "Loading....",
  });

  useEffect(() => {
    const fetchData = async () => {
      // const feedData = await newsFeedService.get(`/getNewsFeed/${user?._id}`);
      // const feedData2 = await feedData.data;
      // if (feedData2.length) {
      //   setfeed(feedData2);
      //   setisLoding({ state: false, data: "data Fetched" });
      // } else {
      //   setisLoding({
      //     state: true,
      //     data:
      //       "No feed remaining for you!!! You should Follow more people....",
      //   });
      //   setTimeout(fetchData, 2000);
      // }
      let followSugg = await (
        await authService.get(`/best/followSuggetions/${user?._id}`)
      ).data; // get follow suggestions
      followSugg = followSugg.map((f) => f._id);
      let following = await (await ffService.get(`/following/${user?._id}`))
        .data; // get  all following
      following = following.map((f) => f.followeeId);
      //all posts of following
      let users = [...followSugg, ...following];
      console.log(users);
      // let users = ["6086fce7ac7fe87778d1400f", "6086ed1024543b08c0d31367"];
      let posts = await postService.post("/allPost/userGroup", {
        group: users,
      });
      posts = await posts.data;
      const answers = await (
        await quansService.post(`/ans/allAns/userGroup`, { group: users })
      ).data;
      let feed = [...posts, ...answers];
      if (feed.length) {
        setfeed(feed);
        setisLoding({ state: false, data: "data Fetched" });
      } else {
        setisLoding({
          state: true,
          data:
            "No feed remaining for you!!! You should Follow more people....",
        });
        setTimeout(fetchData, 2000);
      }
    };
    fetchData();
    return () => {
      clearTimeout();
    };
  }, [user]);

  window.addEventListener("scroll", () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight + 10 > scrollHeight) {
      setisLoding({
        state: true,
        data: "No feed remaining for you!!! You should Follow more people....",
      });
    }
  });

  return (
    <>
      <div id="feedContainer">
        {feed?.map((oneFeed, i) =>
          oneFeed.ans ? (
            <Ans key={i} ans1={oneFeed} type="feed" />
          ) : (
            <Post key={i} postData={oneFeed} />
          )
        )}
      </div>
      {isLoding.state ? (
        <p
          className={
            isLoding.data !== "data Fetched"
              ? `text-center text-warning mt-5 pt-5`
              : `text-center text-success mt-5 pt-5`
          }
        >
          {isLoding.data}
        </p>
      ) : null}
    </>
  );
};

function PostStartButton({ user }) {
  const [assest, setassest] = useState({ assest: [], type: "" });
  const [assestUrl, setassestUrl] = useState("");
  const [caption, setcaption] = useState("");
  const history = useHistory();
  const makePost = () => {
    document.getElementById("showMakePost").classList.add("d-none");
    document.getElementById("makePost").classList.remove("d-none");
  };
  const cancelPost = () => {
    document.getElementById("showMakePost").classList.remove("d-none");
    document.getElementById("makePost").classList.add("d-none");
  };

  const showAssest = (file) => {
    if (file) {
      setassestUrl(URL.createObjectURL(file));
    } else {
      setassestUrl("");
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    let fd = new FormData();
    fd.append("post", assest.assest[0]);
    let upload = await postService.post(
      "/post/assest/" + assest.type + "/" + user?._id,
      fd,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    upload = await upload.data;

    if (upload.msg === "ok") {
      let details = await postService.post("/post/assestDetails", {
        type: assest.type,
        assest: upload.fileName,
        caption: caption,
        doerId: user?._id,
        deorName: user?.name,
        time: upload.time,
      });
      details = await details.data;
      if (details.msg === "ok") {
        toast.success("Your post is live now!!!", { position: "top-center" });
        history.push("/post/" + details?.id);
      } else {
        toast.err(
          "Our server is facing temporary error, please visit after some time.",
          {
            position: "top-center",
          }
        );
      }
    } else {
      toast.err(upload.msg, {
        position: "top-center",
      });
    }
  };
  return (
    <>
      <div className="postStart row">
        <Avatar src={profilePic + user?.profilePic} />
        <div className="boundry" id="showMakePost" onClick={makePost}>
          Make New Post, Show Your Life
        </div>
        <div className="boundry d-none" id="makePost">
          <form onSubmit={handlePost}>
            <textarea
              name="caption"
              id="caption"
              rows="3"
              placeholder="Write Your feelings"
              className="form-control"
              onChange={(e) => setcaption(e.target.value)}
            ></textarea>
            <div className="previewAssest">
              {assestUrl ? (
                assest.type === "image" ? (
                  <img src={assestUrl} alt="assestPreview" />
                ) : (
                  <video src={assestUrl}> </video>
                )
              ) : null}
            </div>
            <div className="assest">
              <div className="image">
                <label htmlFor="image">
                  <ImageIcon />
                  <br />
                  Image
                </label>
                <input
                  onChange={(e) => {
                    setassest({ assest: e.target.files, type: "image" });
                    showAssest(e.target.files[0]);
                  }}
                  type="file"
                  name="image"
                  id="image"
                  multiple={0}
                  accept="image/*"
                />
              </div>
              <div className="video">
                <label htmlFor="video">
                  <VideoLibraryIcon />
                  <br />
                  Video
                </label>
                <input
                  onChange={(e) => {
                    setassest({ assest: e.target.files, type: "video" });
                    showAssest(e.target.files[0]);
                  }}
                  type="file"
                  multiple={0}
                  name="video"
                  id="video"
                  accept="video/*"
                />
              </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "black" }}>
              (One image or video at a time please.)
            </div>
            <button className="my-4 btn btn-success w-100">Upload</button>
          </form>
          <div
            onClick={cancelPost}
            className=" btn-danger ml-auto"
            id="cancelBtn"
          >
            Cancel
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Home;

// position: absolute;
// right: 40px;
// top: 30px;
