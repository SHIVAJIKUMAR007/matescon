import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { authService, quansService } from "../../axios";
import Post from "../Post";
import { Ans } from "../Quans";
import Comment from "./Comment";

function CommentP() {
  const [post, setpost] = useState({});
  const [comment, setcomment] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      const data = await (
        await authService.get(`/comment/getPostByCommentId/${id}`)
      ).data;
      setcomment(data.comment);
      setpost(data.post);
    }
    getData();
  }, [id]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-3 col-12"></div>
          {/* main work is here  */}
          <div className="col-lg-4 col-md-6 col-12 ">
            <Post postData={post} />
            <hr className=" my-3" />
            <h5>Got Comment</h5>
            <hr className=" my-3" />
            <Comment comment={comment} type="post" allReply={true} />
          </div>

          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>{" "}
    </>
  );
}

function ReplyP() {
  const [post, setpost] = useState({});
  const [comment, setcomment] = useState({});
  const [reply, setreply] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      const data = await (
        await authService.get(`/comment/getPostByReplyId/${id}`)
      ).data;
      setcomment(data.comment);
      setpost(data.post);
      setreply(data.reply);
    }
    getData();
  }, [id]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-3 col-12"></div>
          {/* main work is here  */}
          <div className="col-lg-4 col-md-6 col-12 ">
            <Post postData={post} />
            <hr className=" my-3" />
            <h5>Got Reply</h5>
            <hr className=" my-3" />
            <Comment
              comment={comment}
              type="post"
              allReply={false}
              reply={reply}
            />
          </div>

          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>
    </>
  );
}

function CommentQ() {
  const [ans, setans] = useState({});
  const [comment, setcomment] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      const data = await (
        await quansService.get(`/comment/getansByCommentId/${id}`)
      ).data;
      setcomment(data.comment);
      setans(data.ans);
    }
    getData();
  }, [id]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-3 col-12"></div>
          {/* main work is here  */}
          <div className="col-lg-4 col-md-6 col-12 ">
            <Ans ans1={ans} />
            <hr className=" my-3" />
            <h5>Got Comment</h5>
            <hr className=" my-3" />
            <Comment comment={comment} type="quans" allReply={true} />
          </div>

          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>
    </>
  );
}

function ReplyQ() {
  const [ans, setans] = useState({});
  const [comment, setcomment] = useState({});
  const [reply, setreply] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      const data = await (
        await quansService.get(`/comment/getansByReplyId/${id}`)
      ).data;
      setcomment(data.comment);
      setans(data.ans);
      setreply(data.reply);
    }
    getData();
  }, [id]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-3 col-12"></div>
          {/* main work is here  */}
          <div className="col-lg-4 col-md-6 col-12 ">
            <Ans ans1={ans} />
            <hr className=" my-3" />
            <h5>Got Comment</h5>
            <hr className=" my-3" />
            <Comment
              comment={comment}
              type="quans"
              allReply={false}
              reply={reply}
            />
          </div>

          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>
    </>
  );
}

export default CommentP;
export { ReplyP, CommentQ, ReplyQ };
