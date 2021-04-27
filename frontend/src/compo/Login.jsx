import React, { useState } from "react";
import "../style/login.css";
import { NavLink, useHistory } from "react-router-dom";
import { authService } from "../axios";
import { useDispatch } from "react-redux";
import { login } from "../action";
//toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Login() {
  const [Login, setLogin] = useState({ email: "", password: "" });
  // const User = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleChange = (e) => {
    let { value, name } = e.target;
    setLogin((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = await (await authService.post("/login", Login)).data;
    if (
      loginData.msg === "please check your password" ||
      loginData.msg === "user does not exist"
    ) {
      toast.error(loginData.msg, {
        position: "top-center",
      });
    }
    // if the user registed but not complete his profile
    else if (loginData.data.signUpProcess === false) {
      toast.warn(
        "You sould complete your profile, so we could help you in a better way.",
        { position: "top-center" }
      );
      history.push(
        `/almostDone/${loginData.data.collageStatus}/${loginData.data._id}`
      );
    } else {
      dispatch(login(loginData.data));
      console.log(loginData.msg);
      toast.success(loginData.msg, { position: "top-center" });
      history.push("/");
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row login">
          <div className="col-lg-4 col-md-3 col-12"></div>
          <div className="main col-lg-4 col-md-6 col-12">
            <div className="centerDiv px-4 py-3">
              <h2 className=" py-3 text-center">Login</h2>
              <form className=" form-group" onSubmit={handleLogin}>
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
                  id="password"
                  minLength="6"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
                <br />
                <button className="btn btn-lg btn-outline-success w-100">
                  Login
                </button>
              </form>

              <h6 className="text-center mt-4 mb-3">
                Don't Have Account ? <NavLink to="/signup"> Sign Up </NavLink>
              </h6>
            </div>
          </div>
          <div className="col-lg-4 col-md-3 col-12"></div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;
