import React, { useEffect, useState } from "react";
import { ffService, reportService } from "../axios";
import "../style/more.css";
import { moreOptionContentType } from "../someJson";
function More({ user, doer, content, type, parent }) {
  const [following, setfollowing] = useState(0);
  const [report, setreport] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      // is user already following him
      const ffData = await (
        await ffService.get(`/isFollowing/${user?._id}/${doer?._id}`)
      ).data;
      setfollowing(ffData.result);
    };
    fetchData();
  }, [doer, user]);

  const deleteContent = async () => {
    var confi = window.confirm("Are you sure that you are deleting it?");
    if (confi) moreOptionContentType[type](doer, content, parent);
  };

  const startFollow = async () => {
    let startFollow = await ffService.post("/newFollower", {
      followerId: user?._id,
      followeeId: doer?._id,
    });

    startFollow = startFollow.data;
    if (startFollow.msg === "ok") {
      setfollowing(1);
    }
  };
  const unfollow = async () => {
    let unfollow = await ffService.post("/unfollow", {
      followerId: user?._id,
      followeeId: doer?._id,
    });

    unfollow = unfollow.data;
    if (unfollow.msg === "ok") {
      setfollowing(0);
    }
  };
  async function handleSubmit() {
    const reportData = await (
      await reportService.post("/report", {
        parentId: content?.parentId,
        type: type,
        report: report,
        doerId: user?._id,
      })
    ).data;
    if (reportData.result === "ok") {
      console.log("reported");
    }
  }
  return (
    <div className="moreVerHidden">
      {user?._id === doer?._id ? (
        <div onClick={deleteContent}>Delete...</div>
      ) : (
        <>
          <div onClick={following ? unfollow : startFollow}>
            {following ? `Unfollow` : `Follow`}
          </div>
          <div data-toggle="modal" data-target="#exampleModalCenter">
            Report...
          </div>
        </>
      )}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Report...
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="report">
                  Write Your Report.<span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  name="report"
                  id="report"
                  className="form-control"
                  value={report}
                  onChange={(e) => setreport(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  data-dismiss="modal"
                >
                  Submit Quetion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default More;
