import { Avatar } from "@material-ui/core";
import { CameraAlt } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isUserSaved, login, profilePicUpdate } from "../action";
import { profilePic, authService } from "../axios";
import "../style/editProfile.css";

function Parent() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  return <EditProfile user={user} />;
}

function EditProfile({ user }) {
  const dispatch = useDispatch();
  const [pic, setpic] = useState([]);
  const [picUrl, setpicUrl] = useState("");
  const [info, setinfo] = useState({});
  const [UserExist, setUserExist] = useState(true);

  useEffect(() => {
    setinfo({
      ...user,
      collageInterest: user?.collageInterest?.length
        ? user?.collageInterest.toString()
        : "",
    });
  }, [user]);

  const chanageProfilePic = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("pic", pic[0]);
    let uploadPic = await authService.post(
      "/update/profilePic/" + user?._id,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    uploadPic = await uploadPic.data;

    if (uploadPic.msg === "ok") {
      toast.success("Profile Picture is updated.", {
        position: "top-center",
      });
      dispatch(profilePicUpdate(`profilePic/${uploadPic.fileName}`));
    } else {
      toast.error(uploadPic.msg, {
        position: "top-center",
      });
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setinfo((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
    console.log(info);
  };
  const isUsernameTaken = async (e) => {
    e.persist();
    const name = e.target?.name;
    const value = e.target?.value;
    setinfo((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
    let data = await authService.get(
      `/is/username/duplicate/${e.target.value}`
    );
    data = data.data;

    if (data.result) {
      setUserExist(false);
    } else setUserExist(true);

    // handleInfoChange(e);
  };

  const updateInfo = async (e) => {
    e.preventDefault();
    if (info?.username !== user?.username && UserExist === true) {
      toast.error("username is taken", { position: "top-center" });
      return;
    }
    const dataToUpdate = {
      name: info?.name,
      username: info?.username,
      collageFull: info?.collageFull,
      collageInterest: info?.collageInterest.length
        ? info?.collageInterest.split(",")
        : [],
      collageShort: info?.collageShort,
      collageStatus: info?.collageStatus,
      bio: info?.bio,
    }

    let update = await authService.post("/update/wholeData/" + info?._id, dataToUpdate);
    update = await update.data;
    if ((update.msg = "ok")) {
      toast.success("Your data is updated", { position: "top-center" });
      dispatch(login({ ...user,...dataToUpdate }));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-md-2 col-12"></div>
        {/* main work is here  */}
        <div className="editProfile col-lg-6 col-md-8 col-12 ">
          <h2 className="my-4 text-center">Edit Your Profile</h2>
          <h4 className="my-4">Profile Picture</h4>
          <form className="profilePicForm" onSubmit={chanageProfilePic}>
            <div>
              <Avatar
                src={picUrl ? picUrl : `${profilePic}/${user?.profilePic}`}
                id="avatar"
              />
              <label htmlFor="profilePic">
                <br /> <CameraAlt />
              </label>
              <input
                type="file"
                name="profilePic"
                id="profilePic"
                onChange={(e) => {
                  setpic(e.target.files);
                  setpicUrl(URL.createObjectURL(e.target.files[0]));
                }}
                accept="image/*"
                multiple={0}
              />
            </div>
            <center>
              <button type="submit" className="btn btn-outline-success my-4">
                Update Profile Pic
              </button>
            </center>
          </form>
          {/* other information */}

          <h4 className="my-4">Account Information</h4>
          <form onSubmit={updateInfo}>
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInfoChange}
              className=" form-control"
              value={info?.name}
            />
            <br />
            <label htmlFor="username">Username : </label>
            <input
              type="text"
              name="username"
              id="username"
              minLength="6"
              onChange={isUsernameTaken}
              className=" form-control"
              value={info?.username}
            />
            {info?.username !== user?.username ? (
              <span
                className={UserExist ? " text-danger" : "text-success"}
                style={{ fontSize: "0.8rem", marginLeft: "1rem" }}
              >
                {UserExist ? "username is taken" : "username is available"}
              </span>
            ) : null}
            <br />
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInfoChange}
              readOnly
              className=" form-control"
              value={info?.email}
            />
            <br />
            <label htmlFor="bio">Bio : </label>
            <textarea
              type="text"
              bio="bio"
              id="bio"
              onChange={handleInfoChange}
              className=" form-control"
              value={info?.bio}
            />
            <br />
            <label htmlFor="collageStatus">Collage Status : </label>
            <select
              name="collageStatus"
              id="collageStatus"
              onChange={handleInfoChange}
              className=" form-control"
              value={info?.collageStatus}
            >
              <option value="aspirant">Aspirant</option>
              <option value="student">Collage Studing</option>
              <option value="alumuni">Alumuni</option>
            </select>
            <br />
            {user?.collageStatus === "aspirant" ? (
              <>
                <label htmlFor="collageOfInterest">
                  Collage of Interest<span className="text-danger">*</span>
                  <span style={{ fontSize: "0.7rem" }}>
                    (write some collages for which you are curious, saparate by
                    comma(,). )
                  </span>{" "}
                  :
                </label>
                <input
                  type="text"
                  name="collageOfInterest"
                  id="collageOfInterest"
                  onChange={handleInfoChange}
                  className="form-control"
                  value={info?.collageOfInterest}
                />
                <br />
              </>
            ) : (
              <>
                <label htmlFor="collageFull">Collage Full Name :</label>
                <input
                  type="text"
                  name="collageFull"
                  id="collageFull"
                  onChange={handleInfoChange}
                  className="form-control"
                  value={info?.collageFull}
                />
                <br />
                <label htmlFor="collageShort">Collage Short Name :</label>
                <input
                  type="text"
                  name="collageShort"
                  id="collageShort"
                  onChange={handleInfoChange}
                  className="form-control"
                  value={info?.collageShort}
                />
                <br />
              </>
            )}

            <button type="submit" className="btn btn-outline-success w-100">
              Update InFo
            </button>
          </form>

          <ResetPass user={user} />
        </div>
        <div className="col-lg-3 col-md-2 col-12"></div>
      </div>
    </div>
  );
}

function ResetPass({user}){
     const [pass, setpass] = useState({
       currentPassword:'',
       newPassword:'',
       confirmPassword:''
     })
     function handleChange(e){
       const {name,value} = e.target;
        setpass(pre=>{
          return {...pre,
            [name]:value,}
        })
        console.log(pass)
     }

    async function handleSubmit(e){
             e.preventDefault()
             if(pass.newPassword !== pass.confirmPassword){
                toast.error('new password must be same as confirm password',{position:'top-center'})
             }
             else if(pass.currentPassword === pass.newPassword){
                toast.warn('new password is same to the current password',{position:'top-center'})
             }
             else{
                let updatePass = await authService.post('/update/pass/'+user?._id,pass)
                updatePass = updatePass.data
                if(updatePass.msg === 'ok') 
                  toast.success('Your password is updated successfully',{position:'top-center'})
                  setpass({currentPassword:"",newPassword:'',confirmPassword:''})
             }
     }
     return(
          <form onSubmit={handleSubmit}><h4 className="my-4 ">Reset Password</h4>
            <label htmlFor="currentPassword">Current Password :</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              className="form-control"  minLength="6"
              onChange={handleChange}
            />
            <br />
            <label htmlFor="newPassword">New Password :</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="form-control"   minLength="6"           onChange={handleChange}

            />
            <br />
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"   minLength="6"             onChange={handleChange}

            />
            <br />
            <button type="submit" className="btn btn-outline-success w-100 mb-5">
              Reset Password
            </button>
          </form>
     )
}

export default Parent;
