import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { quansService } from "../../axios";
import { isUserSaved } from "../../action";
import Quans from "../Quans";

function AllQue() {
  const [que, setque] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer);
  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      const allque = await (await quansService.get(`/allQuetions/${user?._id}`))
        .data;
      setque(allque);
    };
    fetchData();
  }, [user]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-3 col-12"></div>
          {/* main work is here  */}
          <div className="col-lg-4 col-md-6 col-12 ">
            {que?.map((que, i) => (
              <Quans key={i} queData={que} />
            ))}
          </div>

          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>
    </>
  );
}

export default AllQue;
