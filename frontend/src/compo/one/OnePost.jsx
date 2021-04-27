import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router";
import { postService } from "../../axios";
import Post from "../Post";
function OnePost() {
  const { id } = useParams();
  const [post, setpost] = useState({});
  useLayoutEffect(() => {
    async function fetchData() {
      const postData = await (await postService.get(`/getPostById/${id}`)).data;
      setpost(postData);
    }
    fetchData();
  }, [id]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-3 col-12"></div>
        {/* main work is here  */}
        <div className="col-lg-4 col-md-6 col-12 ">
          <Post postData={post} />
        </div>

        <div className="col-lg-4 col-md-3 col-12"></div>
      </div>
    </div>
  );
}

export default OnePost;
