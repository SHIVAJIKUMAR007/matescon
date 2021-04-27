import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router";
import { quansService } from "../../axios";
import Quans from "../Quans";

function OneQue() {
  const { id } = useParams();
  const [que, setque] = useState({});
  useLayoutEffect(() => {
    async function fetchData() {
      const queData = await (await quansService.get(`/getQuetionById/${id}`))
        .data;
      setque(queData);
    }
    fetchData();
  }, [id]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-3 col-12"></div>
        {/* main work is here  */}
        <div className="col-lg-4 col-md-6 col-12 ">
          <Quans queData={que} setQue={setque} />
        </div>

        <div className="col-lg-4 col-md-3 col-12"></div>
      </div>
    </div>
  );
}

export default OneQue;
