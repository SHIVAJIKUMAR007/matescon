import React, { useEffect, useState, useLayoutEffect } from "react";
import "../style/quans.css";
import { Avatar } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/More";
import { NavLink } from "react-router-dom";
import {
  authService,
  newsFeedService,
  profilePic,
  quansService,
} from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import Comment from "./Comment";
import More from "./More";
import { isElementInViewport, roundOff } from "../someImpFun";
import { satisfationLevel } from "../someJson";
import Share from "./Share";

function Quans({ queData, setQue, type }) {
  const [asker, setasker] = useState({});
  const [AnsToPost, setAnsToPost] = useState("");
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [showMoreOptions, setshowMoreOptions] = useState(false);
  const [ShowShareButtons, setShowShareButtons] = useState(false);

  useLayoutEffect(() => {
    dispatch(isUserSaved());
    async function fetchData() {
      let askerData = await (await authService.get(`/user/${queData?.askerId}`))
        .data;
      setasker(askerData);
    }
    fetchData();
  }, [queData, dispatch]);

  async function postNewAnswer() {
    const dataToSend = {
      ans: AnsToPost,
      queId: queData?._id,
      doerId: user ? user?._id : "Anonymous",
      doerName: user ? user?.name : "Anonymous",
      doerPic: user ? user?.profilePic : "Anonymous",
      askerId: queData?.askerId,
    };

    const postReply = await (await quansService.post("/ans/answer", dataToSend))
      .data;
    if (postReply.msg === "ok") {
      setQue({
        ...queData,
        ansNum: postReply.ansNum,
      });
      setAnsToPost("");
    }
  }

  return (
    <>
      <div className="quetion">
        <div className="queHeader m-2 row">
          <div className="avatarDiv mt-1">
            <Avatar className="avatar" src={profilePic + queData?.askerPic} />
          </div>
          <div className="aboutCreator ml-2">
            <span className="creatorName">{queData?.askerName}</span>
            <p>
              {asker?.collageShort}{" "}
              {asker?.collageStatus === "alumuni" ? <span>Alumuni</span> : null}
            </p>
          </div>
          <div className="mt-3 ml-auto position-relative">
            <MoreVertIcon
              onClick={() => setshowMoreOptions((pre) => (pre ? false : true))}
            />
            {showMoreOptions ? (
              <More user={user} doer={asker} content={queData} type="que" />
            ) : null}
          </div>
        </div>
        <div className="queBody">
          <b>{queData?.que}</b>
        </div>

        <div className="queFooter">
          <div className="answers">
            <img
              src={process.env.PUBLIC_URL + "/answer.png"}
              alt="answer"
              className="img-fluid"
            />
            <span>{queData?.ansNum}</span>
          </div>
          <div style={{ position: "relative" }} className="share ml-auto">
            <ShareIcon
              onClick={() => setShowShareButtons((pre) => (pre ? false : true))}
            />
            {ShowShareButtons ? (
              <Share urlPathName={`/que/${queData?._id}`} />
            ) : null}
          </div>
        </div>
        {/* write a answer */}
        {user?._id !== queData.askerId && user?.collageStatus !== "aspirant" ? (
          <div className="writeAns d-flex mr-4 mt-4">
            <Avatar
              src={`${profilePic}${asker?.profilePic}`}
              className="mx-4"
            />
            <div className="writeAnsDiv " style={{ flex: "1" }}>
              <textarea
                name="Ans"
                className="form-control"
                placeholder={
                  queData?.ansNum
                    ? `write new Answer`
                    : `Be the first one to Answer`
                }
                value={AnsToPost}
                onChange={(e) => setAnsToPost(e.target.value)}
              ></textarea>
              <button
                className="btn btn-success ml-auto mt-2"
                onClick={postNewAnswer}
              >
                Post Answer
              </button>
            </div>
          </div>
        ) : null}

        {/* all answers */}
        <div
          className="d-flex my-5"
          style={{
            borderBottom: "1px solid grey",
            borderTop: "1px solid grey",
            padding: "0.5rem 1rem",
          }}
        >
          <MoreIcon style={{ color: "blue", marginRight: "0.8rem" }} />
          <span>{queData?.ansNum} Answers</span>
        </div>
        {queData?.ansNum ? (
          <AllAns que={queData} />
        ) : (
          <h4 className="my-5 py-5 text-center"> No Answers Yet </h4>
        )}
      </div>
    </>
  );
}

const AllAns = ({ que }) => {
  const [ans, setans] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const ans = await (
        await quansService.get(`/ans/getAnswers/ofQuetion/${que?._id}`)
      ).data;
      setans(ans);
    }
    fetchData();
  }, [que]);

  return (
    <>
      {ans?.map((ans, i) => (
        <Ans key={i} ans1={ans} type="belowQue" />
      ))}
    </>
  );
};

export const Ans = ({ ans1, type }) => {
  const [ans, setans] = useState({});
  const [ShowComments, setShowComments] = useState(0);
  const [doerData, setdoerData] = useState({});
  const [queData, setqueData] = useState({});
  const [showCommentPostTool, setshowCommentPostTool] = useState(0);
  const [commentToPost, setcommentToPost] = useState("");
  const [credit, setcredit] = useState(3);
  const [ShowShareButtons, setShowShareButtons] = useState(false);
  const [isCredited, setisCredited] = useState({
    msg: "not credited",
    result: 0,
    currCredit: null,
  });
  const [showMoreOptions, setshowMoreOptions] = useState(false);
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    setans(ans1);
    setcredit(
      roundOff(parseInt(ans1?.creditScore), parseInt(ans1?.creditVoteNum))
    );
  }, [ans1]);
  useEffect(() => {
    dispatch(isUserSaved());
    const fetchData = async () => {
      //doer data
      const doer = await (await authService.get("/user/" + ans?.doerId)).data;
      setdoerData(doer);
      // que data
      const que = await (
        await quansService.get("/getQuetionById/" + ans?.queId)
      ).data;
      setqueData(que);
      //isCredited
      const isCredit = await (
        await quansService.get(`/credit/isCredited/${ans?._id}/${user?._id}`)
      ).data;
      if (isCredit.result !== 2) setisCredited(isCredit);
    };
    fetchData();
  }, [ans, user, dispatch]);
  // function to post comment

  async function postNewComment() {
    const dataToSend = {
      comment: commentToPost,
      ansId: ans?._id,
      doerId: user ? user?._id : "Anonymous",
      doerName: user ? user?.name : "Anonymous",
      doerPic: user ? user?.profilePic : "Anonymous",
    };
    const postComment = await (
      await quansService.post("/comment/comment", dataToSend)
    ).data;
    if (postComment.msg === "ok") {
      setans({
        ...ans,
        commentCount: postComment.commentCount,
      });
      setcommentToPost("");
      setShowComments(1);
      setshowCommentPostTool(0);
    }
  }
  const updateCredit = async (newCredit) => {
    //api call
    const dataToSend = {
      creditStatus: isCredited.result,
      ansId: ans?._id,
      doerId: user?._id,
      doerName: user?.name,
      doerPic: user?.profilePic,
      credit: newCredit,
      preCredit: isCredited?.currCredit,
    };
    let addCredit = await (
      await quansService.post("/credit/credit", dataToSend)
    ).data;

    if (addCredit?.msg === "ok") {
      //update ans
      setans({
        ...ans,
        creditScore: addCredit?.creditScore,
        creditVoteNum: addCredit?.creditVoteNum,
      });
      //update stisfaction level img value
      setcredit(
        roundOff(
          parseInt(addCredit?.creditScore),
          parseInt(addCredit?.creditVoteNum)
        )
      );
      //update isCredited
      setisCredited({ msg: "credited", result: 1, currCredit: newCredit });
      //to display none the option
      document.getElementById("allCredits").classList.add("d-none");
      setTimeout(() => {
        document.getElementById("allCredits").classList.remove("d-none");
      }, 500);
    }
  };

  useEffect(() => {
    const isInViewPort = async () => {
      const el = document.getElementById(`ans_${ans?._id}`);
      if (isElementInViewport(el)) {
        clearInterval(interval);
        //send viewed status for this part to newsfeed service
        const viewedStatus = await (
          await newsFeedService.post(`/markAsviewed`, {
            content: ans,
            type: "ans",
            doerId: ans?.doerId,
          })
        ).data;
        console.log(viewedStatus);
        if (viewedStatus?.msg === "ok") {
          console.log(viewedStatus);
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
  }, [ans]);
  return (
    <>
      <div className="answer">
        <div className="ansHeader m-2 row">
          <div className="avatarDiv mt-1">
            <Avatar className="avatar" src={profilePic + ans?.profilePicUrl} />
          </div>
          <div className="aboutCreator ml-2">
            <span className="creatorName">{ans?.doerName}</span>
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
                content={ans}
                parent={queData}
                type="ans"
              />
            ) : null}
          </div>
        </div>
        {type === "belowQue" ? null : (
          <div className="queBody">
            <NavLink to={`/que/` + queData?._id}>
              <b>{queData?.que}</b>
            </NavLink>
          </div>
        )}
        <div className="ansBody" id={`ans_${ans?._id}`}>
          {ans?.ans}
        </div>

        <div className="ansFooter">
          <div className="likes">
            <div
              className="credits"
              style={
                isCredited
                  ? { color: satisfationLevel[5 - credit]?.color }
                  : { color: "black" }
              }
            >
              {satisfationLevel[5 - credit]?.img}
            </div>
            <div id="allCredits">
              {satisfationLevel?.map((x, i) => (
                <div
                  key={i}
                  onClick={() => (user ? updateCredit(x?.value) : null)}
                >
                  {x?.img}
                </div>
              ))}
            </div>
            <span>
              {ans?.creditScore
                ? Math.floor(
                    (parseInt(ans?.creditScore) * 100) /
                      (parseInt(ans?.creditVoteNum) * 5)
                  ) + "%"
                : "NRY"}
              <span style={{ fontSize: "0.5rem" }}>
                Satisfactory Answer({ans.creditVoteNum} rating)
              </span>
            </span>
          </div>
          <div
            className="comment"
            onClick={() => setshowCommentPostTool((pre) => (pre ? 0 : 1))}
          >
            <CommentIcon /> <span>{ans?.commentCount}</span>
          </div>
          <div style={{ position: "relative" }} className="share">
            <ShareIcon
              onClick={() => setShowShareButtons((pre) => (pre ? false : true))}
            />
            {ShowShareButtons ? (
              <Share urlPathName={`/ans/${ans?._id}`} />
            ) : null}
          </div>
        </div>

        {/*  div to post comment */}
        {showCommentPostTool ? (
          <div className="writeComment d-flex my-3 mr-4">
            <Avatar src={`${profilePic}${user?.profilePic}`} className="mx-4" />
            <div className="writeCommentDiv " style={{ flex: "1" }}>
              <textarea
                name="comment"
                className="form-control"
                placeholder={
                  ans?.commentCount
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

        {ans?.commentCount ? (
          <div className="commentdiv" id="commentdiv">
            {ShowComments ? (
              <AllComments
                ansId={ans?._id}
                setShowComments={setShowComments}
                parent={ans}
              />
            ) : (
              <div className="commentViewer" onClick={() => setShowComments(1)}>
                <span>View {ans?.commentCount} comments</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};

const AllComments = ({ ansId, setShowComments, parent }) => {
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const comments = await (
        await quansService.get(`/comment/getComments/${ansId}`)
      ).data;
      setcomments(comments);
    }
    fetchData();
  }, [ansId]);

  return (
    <>
      <div className="commentViewer" onClick={() => setShowComments(0)}>
        <span>Hide comments</span>
      </div>

      {comments?.map((comment, i) => (
        <Comment key={i} comment={comment} type="quans" parent={parent} />
      ))}
    </>
  );
};

export default Quans;
