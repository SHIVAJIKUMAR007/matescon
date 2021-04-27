import React, { useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import "../style/signUp.css";
import { authService } from "../axios";
import { useDispatch } from "react-redux";
import { login } from "../action";
//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function SignUp() {
  const [collageStatus, setcollageStatus] = useState("");
  const history = useHistory();
  const [signUp, setsignUp] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const handleChange = (e) => {
    let { value, name } = e.target;
    setsignUp((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signUp.password !== signUp.cpassword) {
      toast.error("Password must be same as Confirm Password.", {
        position: "top-center",
      });
    }

    const dataToSend = {
      name: signUp.name,
      username: signUp.username,
      email: signUp.email,
      password: signUp.password,
      collageStatus: collageStatus,
      signUpProcess: false,
      creditScore: 0,
    };
    const data = await (await authService.post("/signup", dataToSend)).data;
    console.log(data);
    toast.success(
      "You registered successfully, now you sould complete your profile",
      { position: "top-center" }
    );
    history.push("/almostDone/" + collageStatus + "/" + data.user._id);
  };

  const changeCollageStatus = (e) => {
    setcollageStatus(e.target.id);
    let allDiv = document.getElementsByClassName("collageStatusDiv");
    for (let i = 0; i < allDiv.length; i++) {
      allDiv[i].classList.remove("selected");
    }
    document.getElementById(e.target.id).classList.add("selected");
    console.log(collageStatus);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row signUp">
          <div className="col-lg-4 col-md-3 col-12"></div>
          <div className="main col-lg-4 col-md-6 col-12">
            <div className="centerDiv px-4 py-3">
              <h2 className=" py-3 text-center">Sign Up</h2>
              {/* collage status  */}
              <p style={{ margin: "0.4rem 3.5rem", fontWeight: "600" }}>
                Collage
              </p>
              <div
                className="collageStatus row"
                style={{ margin: "0.5rem 0rem" }}
              >
                <div
                  className="collageStatusDiv col-lg-4 col-md-4 col-4 "
                  id="aspirant"
                  onClick={changeCollageStatus}
                >
                  Aspirant
                </div>
                <div
                  className="collageStatusDiv col-lg-4 col-md-4 col-4 "
                  id="student"
                  onClick={changeCollageStatus}
                >
                  Student
                </div>
                <div
                  className="collageStatusDiv col-lg-4 col-md-4 col-4 "
                  id="alumuni"
                  onClick={changeCollageStatus}
                >
                  Alumuni
                </div>
              </div>
              {collageStatus ? (
                <form className=" form-group" onSubmit={handleSignUp}>
                  <label htmlFor="name">
                    Name <span className="text-danger">*</span> :
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="username">
                    Username <span className="text-danger">*</span> :
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="form-control"
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                  <br />
                  <label htmlFor="email">
                    Email <span className="text-danger">*</span> :
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="password">
                    Password <span className="text-danger">*</span> :
                  </label>
                  <input
                    type="password"
                    name="password"
                    minLength="6"
                    id="password"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                  <br />
                  <label htmlFor="cpassword">
                    Confirm Password <span className="text-danger">*</span> :
                  </label>
                  <input
                    type="password"
                    name="cpassword"
                    id="cpassword"
                    minLength="6"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />{" "}
                  <br />
                  <button className="btn btn-lg btn-outline-success w-100">
                    Sign Up
                  </button>
                  <h6 className="text-center mt-4 mb-3">
                    Already Have Account ? <NavLink to="/login"> login</NavLink>
                  </h6>
                </form>
              ) : null}
            </div>
          </div>
          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export const AlmostDone = () => {
  const date = new Date();
  const urlData = useParams();
  // const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const [pic, setpic] = useState([]);
  const [extraData, setextraData] = useState({
    // profilePic: [],
    collageOfInterest: "",
    collageFull: "",
    collageShort: "",
    passingYear: null,
    bio: "",
  });
  const collageStatus = urlData.collageStatus;
  const id = urlData.id;

  function handleChange(e) {
    let { value, name } = e.target;
    setextraData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pic", pic[0]);

    let uploadPic = await authService.post(
      "/update/profilePic/" + id,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    uploadPic = await uploadPic.data;

    if (uploadPic.msg === "ok") {
      const dataToSend = {
        ...extraData,
        signUpProcess: true,
        collageInterest: extraData.collageInterest?.split(","),
      };

      const returnData = await (
        await authService.post("/update/extraData/" + id, dataToSend)
      ).data;
      // returnData = await returnData.data;
      console.log(returnData);
      if (returnData.msg === "ok") {
        toast.success(
          `hey ${returnData.result.name}, welcome to matesCon World.`,
          {
            position: "top-center",
          }
        );
        dispatch(login({ ...returnData.result, ...dataToSend }));
        history.push("/");
      } else {
        toast.error(returnData.msg, {
          position: "top-center",
        });
      }
    } else {
      toast.error(uploadPic.msg, {
        position: "top-center",
      });
    }
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row signUp">
          <div className="col-lg-4 col-md-3 col-12"></div>
          <div className="main col-lg-4 col-md-6 col-12">
            <div className="centerDiv px-4 py-3">
              <h2 className=" py-3 text-center">Almost done!!!</h2>
              <p className="text-center" style={{ margin: "0" }}>
                Hey bro, you sould complete your profile to get the best
                knowledge.
              </p>

              <form className=" form-group" onSubmit={handleSubmit}>
                <label htmlFor="profilePic">Profile Pic :</label>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  id="profilePic"
                  onChange={(e) => setpic(e.target.files)}
                  className="form-control"
                />
                <br />
                {collageStatus === "aspirant" ? (
                  <>
                    <label htmlFor="collageOfInterest">
                      Collage of Interest<span className="text-danger">*</span>
                      <span style={{ fontSize: "0.7rem" }}>
                        (write some collages for which you are curious, saparate
                        by comma(,). )
                      </span>{" "}
                      :
                    </label>
                    <input
                      type="text"
                      name="collageOfInterest"
                      id="collageOfInterest"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                    <br />
                  </>
                ) : null}
                {collageStatus === "aspirant" ? null : (
                  <>
                    <label htmlFor="collageFull">
                      Collage Full Name <span className="text-danger">*</span> :
                    </label>
                    <input
                      type="text"
                      name="collageFull"
                      id="collageFull"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                    <br />
                    <label htmlFor="collageShort">
                      Collage Short Name <span className="text-danger">*</span>{" "}
                      :
                    </label>
                    <input
                      type="text"
                      name="collageShort"
                      id="collageShort"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                    <br />
                    <label htmlFor="passingYear">
                      Year Of Passing <span className="text-danger">*</span>{" "}
                      <span style={{ fontSize: "0.7rem" }}>
                        ( expected if your are curruntly studing )
                      </span>
                      :
                    </label>
                    <input
                      type="text"
                      name="passingYear"
                      id="passingYear"
                      min={date.getFullYear() - 40}
                      max={date.getFullYear() + 5}
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                    <br />
                  </>
                )}
                <label htmlFor="bio">Bio :</label>
                <textarea
                  type="text"
                  name="bio"
                  id="bio"
                  onChange={handleChange}
                  className="form-control"
                />
                <br />
                <button className="btn btn-lg btn-outline-success w-100">
                  Complete
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default SignUp;
