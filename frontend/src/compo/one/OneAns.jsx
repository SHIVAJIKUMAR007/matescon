import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router";
import { quansService } from "../../axios";
import { Ans } from "../Quans";
function OneAns() {
  const { id } = useParams();
  const [ans, setans] = useState({});
  useLayoutEffect(() => {
    async function fetchData() {
      const ansData = await (await quansService.get(`/ans/getAnswerById/${id}`))
        .data;
      setans(ansData);
    }
    fetchData();
  }, [id]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-3 col-12"></div>
        {/* main work is here  */}
        <div className="col-lg-4 col-md-6 col-12 ">
          <Ans ans1={ans} type="feed" />
        </div>

        <div className="col-lg-4 col-md-3 col-12"></div>
      </div>
    </div>
  );
}

export default OneAns;
