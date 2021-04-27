import React, { useEffect, useState } from "react";
import "../style/post.css";
import { Avatar } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";
import Comment from "./Comment";
import {
  postService,
  authService,
  postAssest,
  profilePic,
  newsFeedService,
} from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import { isElementInViewport } from "../someImpFun";
import More from "./More";
import Share from "./Share";
function Post({ postData }) {
  const [ShowComments, setShowComments] = useState(0);
  const [showCommentPostTool, setshowCommentPostTool] = useState(0);
  const [doerData, setdoerData] = useState({});
  const [activityDetail, setactivityDetail] = useState({});
  const [commentToPost, setcommentToPost] = useState("");
  const [isLiked, setisLiked] = useState({ msg: "", result: 0 });
  const user = useSelector((state) => state.authReducer);
  const [showMoreOptions, setshowMoreOptions] = useState(false);
  const [ShowShareButtons, setShowShareButtons] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isUserSaved());
    const fetchData = async () => {
      //post doer details
      const doer = await (await authService.get(`/user/${postData?.doerId}`))
        .data;
      setdoerData(doer);
      //post other details
      const activity = await (
        await postService.get(`/getActivityByActId/${postData?._id}`)
      ).data;
      setactivityDetail(activity);
      //isLiked
      const isLike = await (
        await postService.get(
          `/like/isLiked/${postData?._id}/${postData?.doerId}`
        )
      ).data;
      setisLiked(isLike);
    };
    fetchData();
  }, [postData, dispatch]);
  // fincton to like the post
  async function likeIt() {
    const like = {
      likeStatus: isLiked.msg,
      type: "post",
      aid: postData?._id,
      doerId: user?._id,
      doerName: user?.name,
      doerPic: user?.profilePic,
    };
    let likedata = await (await postService.post(`/like/like`, like)).data;

    if (likedata.msg === "ok") {
      setisLiked({ msg: "liked", result: 1 });
      setactivityDetail({ ...activityDetail, likeCount: likedata.likeCount });
    }
  }
  //function to dislike the post
  async function dislikeIt() {
    let likedata = await (
      await postService.post(`/like/dislike`, {
        aid: postData?._id,
        doerId: user?.doerId,
      })
    ).data;

    if (likedata.msg === "ok") {
      setisLiked({ msg: "liked not active", result: 2 });
      setactivityDetail({ ...activityDetail, likeCount: likedata.likeCount });
    }
  }

  // function to post comment

  async function postNewComment() {
    const dataToSend = {
      comment: commentToPost,
      aid: postData?._id,
      doerId: user ? user?._id : "Anonymous",
      doerName: user ? user?.name : "Anonymous",
      doerPic: user ? user?.profilePic : "Anonymous",
    };

    const postComment = await (
      await postService.post("/comment/comment", dataToSend)
    ).data;
    if (postComment.msg === "ok") {
      setactivityDetail({
        ...activityDetail,
        commentCount: postComment.commentCount,
      });
      setcommentToPost("");
      setShowComments(1);
      setshowCommentPostTool(0);
    }
  }

  useEffect(() => {
    const isInViewPort = async () => {
      const el = document.getElementById(`postMedia_${postData?._id}`);
      if (isElementInViewport(el)) {
        clearInterval(interval);
        //send viewed status for this part to newsfeed service
        const viewedStatus = await (
          await newsFeedService.post(`/markAsviewed`, {
            content: postData,
            type: "post",
            doerId: doerData?._id,
          })
        ).data;
        console.log(viewedStatus);
        if (viewedStatus?.msg === "ok") {
          return;
        } else {
          interval();
        }
      }
    };
    const interval = setInterval(isInViewPort, 500);
    return () => {
      clearInterval(interval);
    };
  }, [postData, doerData]);
  return (
    <>
      <div className="post">
        <div className="postHeader m-2 row">
          <div className="avatarDiv mt-1">
            <Avatar
              className="avatar"
              src={`${profilePic}${doerData?.profilePic}`}
            />
          </div>
          <div className="aboutCreator ml-2">
            <span className="creatorName">{doerData?.name}</span>
            <p>
              {doerData?.collageShort}{" "}
              {doerData?.collageStatus === "alumuni" ? (
                <span>Alumuni</span>
              ) : null}
            </p>
          </div>
          <div className="mt-3 ml-auto position-relative">
            <MoreVertIcon
              onClick={() => setshowMoreOptions((pre) => (pre ? false : true))}
            />
            {showMoreOptions ? (
              <More
                user={user}
                doer={doerData}
                content={postData}
                type="post"
              />
            ) : null}
          </div>
        </div>
        <div className="caption">{postData?.caption}</div>
        <div className="postMedia" id={`postMedia_${postData?._id}`}>
          {postData?.type === "image" ? (
            <img
              src={`${postAssest}${postData?.asset}`}
              alt="postImage"
              className="postImage"
            />
          ) : (
            <video
              className="postVideo"
              src={`${postAssest}${postData?.asset}`}
            ></video>
          )}
        </div>

        <div className="postFooter">
          <div
            className="likes"
            onClick={user ? (isLiked.result === 1 ? dislikeIt : likeIt) : null}
          >
            <FavoriteIcon
              style={isLiked.result === 1 ? { color: "red" } : null}
            />
            <span>{activityDetail?.likeCount}</span>
          </div>
          <div
            className="comment"
            onClick={() => setshowCommentPostTool((pre) => (pre ? 0 : 1))}
          >
            <CommentIcon /> <span>{activityDetail?.commentCount}</span>
          </div>
          <div style={{ position: "relative" }} className="share">
            <ShareIcon
              onClick={() => setShowShareButtons((pre) => (pre ? false : true))}
            />
            {ShowShareButtons ? (
              <Share urlPathName={`/post/${postData?._id}`} />
            ) : null}
          </div>
        </div>
        {/* div to tell you and 123 other liked this post  */}
        {/*  div to post comment */}
        {showCommentPostTool ? (
          <div className="writeComment d-flex mr-4">
            <Avatar src={`${profilePic}${user?.profilePic}`} className="mx-4" />
            <div className="writeCommentDiv " style={{ flex: "1" }}>
              <textarea
                name="comment"
                className="form-control"
                placeholder={
                  activityDetail?.commentCount
                    ? `write new comment`
                    : `Be the first one to comment`
                }
                onChange={(e) => setcommentToPost(e.target.value)}
              ></textarea>
              <button
                className="btn btn-success ml-auto mt-2"
                onClick={postNewComment}
              >
                Post
              </button>
            </div>
          </div>
        ) : null}

        {activityDetail?.commentCount ? (
          <div className="commentdiv" id="commentdiv">
            {ShowComments ? (
              <AllComments
                pid={postData?._id}
                setShowComments={setShowComments}
                parent={postData}
              />
            ) : (
              <div className="commentViewer" onClick={() => setShowComments(1)}>
                <span>View {activityDetail?.commentCount} comments.</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}

const AllComments = ({ pid, setShowComments, parent }) => {
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const comments = await (
        await postService.get(`/comment/getComments/${pid}`)
      ).data;
      setcomments(comments);
    }
    fetchData();
  }, [pid]);

  return (
    <>
      <div className="commentViewer" onClick={() => setShowComments(0)}>
        <span>Hide comments section</span>
      </div>

      {comments?.map((comment, i) => (
        <Comment key={i} comment={comment} type="post" parent={parent} />
      ))}
    </>
  );
};

export default Post;
