import React, { useState, useEffect } from "react";
import "../../style/post.css";
import { timeToAgo } from "../../someImpFun";
import { Avatar } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ReplyIcon from "@material-ui/icons/Reply";
import { postService, quansService, profilePic } from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../../action";
import { AllReplies, Reply } from "../Comment";
function Comment({ comment, type, allReply, reply }) {
  const [activity, setactivity] = useState({});
  const [showReply, setshowReply] = useState(0);
  const [showReplyPost, setshowReplyPost] = useState(0);
  const [isLiked, setisLiked] = useState({ msg: "", result: 0 });

  const [replyToPost, setreplyToPost] = useState("");
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(isUserSaved());
    const fetchData = async () => {
      if (type === "quans") {
        setactivity({
          likeCount: comment?.likeCount,
          replyCount: comment?.replyCount,
        });
        //isLiked
        const isLike = await (
          await quansService.get(
            `/comment/isLiked/${comment?._id}/${comment?.doerId}`
          )
        ).data;
        setisLiked(isLike);
      } else {
        const act = await (
          await postService.get(`/getActivityByActId/${comment?._id}`)
        ).data;
        setactivity(act);
        //isLiked
        const isLike = await (
          await postService.get(
            `/like/isLiked/${comment?._id}/${comment?.doerId}`
          )
        ).data;
        setisLiked(isLike);
      }
    };
    fetchData();
  }, [comment, type, dispatch]);
  // fun to post reply
  async function postNewReply() {
    if (type === "quans") {
      const dataToSend = {
        reply: replyToPost,
        commentId: comment?._id,
        doerId: user?._id,
        doerName: user?.name,
        doerPic: user?.profilePic,
      };

      const postReply = await (
        await quansService.post("/comment/reply", dataToSend)
      ).data;
      if (postReply.msg === "ok") {
        setactivity({
          ...activity,
          replyCount: postReply.replyCount,
        });
        setreplyToPost("");
        setshowReply(1);
        setshowReplyPost(0);
      }
    } else {
      const dataToSend = {
        reply: replyToPost,
        commentId: comment?._id,
        doerId: user?._id,
        doerName: user?.name,
        doerPic: user?.profilePic,
      };

      const postReply = await (
        await postService.post("/comment/reply", dataToSend)
      ).data;
      if (postReply.msg === "ok") {
        setactivity({
          ...activity,
          replyCount: postReply.replyCount,
        });
        setreplyToPost("");
        setshowReply(1);
        setshowReplyPost(0);
      }
    }
  }

  // functon to like the comment
  async function likeIt() {
    if (type === "quans") {
      const like = {
        commentId: comment?._id,
        doerId: user?._id,
        doerName: user?.name,
        doerPic: user?.profilePic,
      };
      let likedata = await (
        await quansService.post(`/comment/comment/like`, like)
      ).data;

      if (likedata.msg === "ok") {
        setisLiked({ msg: "liked", result: 1 });
        setactivity({ ...activity, likeCount: likedata.likeCount });
      }
    } else {
      const like = {
        likeStatus: isLiked.msg,
        type: "comment",
        aid: comment?._id,
        doerId: user?._id,
        doerName: user?.name,
        doerPic: user?.profilePic,
      };
      let likedata = await (await postService.post(`/like/like`, like)).data;

      if (likedata.msg === "ok") {
        setisLiked({ msg: "liked", result: 1 });
        setactivity({ ...activity, likeCount: likedata.likeCount });
      }
    }
  }
  //function to dislike the comment
  async function dislikeIt() {
    if (type === "quans") {
      const filter = {
        commentId: comment?._id,
        doerId: user?._id,
      };
      console.log(filter);
      let likedata = await (
        await quansService.post(`/comment/comment/disLike`, filter)
      ).data;

      if (likedata.msg === "ok") {
        setisLiked({ msg: "not liked yet", result: 0 });
        setactivity({ ...activity, likeCount: likedata.likeCount });
      }
    } else {
      let likedata = await (
        await postService.post(`/like/dislike`, {
          aid: comment?._id,
          doerId: user?._id,
        })
      ).data;

      if (likedata.msg === "ok") {
        setisLiked({ msg: "liked not active", result: 2 });
        setactivity({ ...activity, likeCount: likedata.likeCount });
      }
    }
  }
  return (
    <>
      <div className="comment">
        <div className="commentHeader m-2 row">
          <div className="avatarDiv mt-1">
            <Avatar
              className="avatar"
              src={`${profilePic}${comment?.profilePicUrl}`}
            />
          </div>
          <div className="aboutCreator ml-2">
            <span className="creatorName">{comment?.doerName}</span>
          </div>
          <div className="mt-3 ml-auto">
            <MoreVertIcon />
          </div>
        </div>
        <div className="commentText">{comment?.comment}</div>

        <div className="commentFooter">
          <div className="time">
            <span>{timeToAgo(Date.parse(comment?.time))}</span>
          </div>
          <div
            className="likes"
            onClick={isLiked.result === 1 ? dislikeIt : likeIt}
          >
            <FavoriteIcon
              style={isLiked.result === 1 ? { color: "red" } : null}
            />
            <span>{activity?.likeCount}</span>
          </div>
          <div
            className="reply"
            onClick={() => {
              setshowReplyPost((pre) => (pre ? 0 : 1));
            }}
          >
            <ReplyIcon /> <span>{activity?.replyCount}</span>
          </div>
        </div>

        {showReplyPost ? (
          <div className="writeReply d-flex">
            <Avatar src={`${profilePic}${user?.profilePic}`} className="mx-4" />
            <div className="writeReplyDiv " style={{ flex: "1" }}>
              <textarea
                name="reply"
                className="form-control"
                placeholder={
                  activity?.replyCount
                    ? `write new Reply`
                    : `Be the first one to Reply`
                }
                value={replyToPost}
                onChange={(e) => setreplyToPost(e.target.value)}
              ></textarea>
              <button
                className="btn btn-success ml-auto mt-2"
                onClick={postNewReply}
              >
                Reply
              </button>
            </div>
          </div>
        ) : null}

        {activity.replyCount && allReply ? (
          <div className="replyDiv" id="replyDiv">
            {showReply ? (
              <AllReplies
                type={type}
                cid={comment._id}
                setshowReply={setshowReply}
              />
            ) : (
              <div className="replyViewer" onClick={() => setshowReply(1)}>
                <span>View {activity.replyCount} reply</span>
              </div>
            )}
          </div>
        ) : null}
        {allReply ? null : <Reply reply={reply} />}
      </div>
    </>
  );
}

export default Comment;
