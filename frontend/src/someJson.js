import React from "react";

import SentimentVerySatisfiedOutlinedIcon from "@material-ui/icons/SentimentVerySatisfiedOutlined";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentDissatisfiedOutlinedIcon from "@material-ui/icons/SentimentDissatisfiedOutlined";
import SentimentVeryDissatisfiedOutlinedIcon from "@material-ui/icons/SentimentVeryDissatisfiedOutlined";
import { postService, quansService } from "./axios";

export const satisfationLevel = [
  { img: <SentimentVerySatisfiedOutlinedIcon />, value: 5, color: "green" },
  { img: <SentimentSatisfiedOutlinedIcon />, value: 4, color: "blue" },
  { img: <SentimentSatisfiedIcon />, value: 3, color: "brown" },
  { img: <SentimentDissatisfiedOutlinedIcon />, value: 2, color: "orange" },
  { img: <SentimentVeryDissatisfiedOutlinedIcon />, value: 1, color: "red" },
];

export const targetUrl = {
  increaseFollowing: "/profile/",
  "post new post": "/profile/",
  "post like": "/post/",

  "comment like": "/commentp/",

  "comment on post": "/commentp/",

  "reply on comment of post": "/replyp/",

  "new quetion added": "/que/",

  "New Answer": "/ans/",

  "answer is credited": "/ans/",

  "comment of quans": "/commentq/",

  "reply on comment of quans": "/replyq/",

  "like on comment of quans": "/commentq/",
};

export const moreOptionContentType = {
  post: async (doer, content, parent) => {
    const deleteIt = await (
      await postService.post(`/delete/post/${content?._id}`, {
        doerId: doer?._id,
      })
    ).data;
    if (deleteIt.msg === "ok") {
      window.location.reload();
    }
  },
  commentp: async (doer, content, parent) => {
    const deleteIt = await (
      await postService.post(`/comment/deleteComment/${content?._id}`, {
        aid: parent?._id,
      })
    ).data;
    if (deleteIt.msg === "ok") {
      window.location.reload();
    }
  },
  que: async (doer, content, parent) => {
    const deleteIt = await (
      await quansService.post(`/deleteQuetion/${content?._id}`, {
        askerId: content?.askerId,
      })
    ).data;
    if (deleteIt.msg === "ok") {
      window.location.reload();
    }
  },
  ans: async (doer, content, parent) => {
    const deleteIt = await (
      await quansService.post(
        `/ans/deleteAnswer/${content?._id}/${parent?._id}`,
        { doerId: content?.doerId }
      )
    ).data;
    if (deleteIt.msg === "ok") {
      window.location.reload();
    }
  },
  commentq: async (doer, content, parent) => {
    const deleteIt = await (
      await quansService.post(
        `/comment/deleteComment/${content?._id}/${parent?._id}`,
        {}
      )
    ).data;
    if (deleteIt.msg === "ok") {
      window.location.reload();
    }
  },
};
