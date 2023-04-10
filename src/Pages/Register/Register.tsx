import { useState } from "react";
import openEyesIcon from "../../Assets/icons/openEyesIcon.svg";
import closedEyesIcon from "../../Assets/icons/closedEyesIcon.svg";
import googleIcon from "../../Assets/icons/googleIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { registerNewUser } from "../../utils/axiosCalls"
import "./Sign.css"
import { useDispatch } from "react-redux"
import { setIsLoggedIn } from "../../Features/AuthSlice";
import { setCookie } from "../../utils/cookies";
import { setUsername, setUserEmail } from "../../Features/MainSlice";
import { googleRegisterUrl } from "../../utils/google";




const Register = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [viewPassword, setviewPassword] = useState<boolean>(false);
  const [username, setusername] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [confirmPassword, setconfirmPassword] = useState<string>("");

  let [isPasswordSame, setisPasswordSame] = useState<boolean>(true);
  let [isPasswordStrong, setisPasswordStrong] = useState<boolean>(true);
  let [isEmailCorrect, setisEmailCorrect] = useState<boolean>(true);
  let [isEmailInUse, setisEmailInUse] = useState<boolean>(false);
  let [isNameCorrect, setisNameCorrect] = useState<boolean>(true);

  const [loading, setloading] = useState<boolean>(false);

  const register = async () => {
    if (username.length < 1) {
      setisNameCorrect(false);
      return;
    }
    if (!email.includes("@")) {
      setisEmailCorrect(false);
      return;
    }
    if (password !== confirmPassword) {
      setisPasswordSame(false);
      return;
    }
    if (password.length < 6 || password === "123456") {
      setisPasswordStrong(false);
      return;
    }
    setloading(true)
    registerNewUser(username, email, password)
      .then((res) => {
        dispatch(setIsLoggedIn(true))
        setCookie("accessToken", res.data.accessToken, 1)
        setCookie("refreshToken", res.data.refreshToken, 7)
        dispatch(setUsername(username))
        dispatch(setUserEmail(email))
        navigate("/dashboard")
        localStorage.setItem("email", email)
        setloading(false)
      })
      .catch((error) => {
        setloading(false)
        if (error.response.data === "Email has already been used, login") {
          setisEmailInUse(true)
        } else {
          console.log(error)
        }
      })
  };

  return (
    <div className="SignContainer">
      <div className="signContainer1">
        <div className="signContainer1Inner">
          <h2>Register a free account</h2>
          <div>
            <p>Already have an account?</p>
            <Link to={"/login"} className="hoverable">
              <button className="signLButton">Login</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="signContainer2">
        <div className="signContainer2Inner">
          <p className="signContainer2InnerT">Get Started</p>
          <Link to={googleRegisterUrl} className="link hoverable">
            <div className="signWithGoogle">
              <img src={googleIcon} alt="" id="googleIcon" />
              <p>Sign up with google</p>
            </div>
          </Link>
          <div className="orDiv">or</div>
          <div className="signItems">
            <div>Name</div>
            <input
              type="text"
              name="name"
              className="signItemsInputs"
              onChange={(e) => {
                setusername(e.target.value);
              }}
            />
            {!isNameCorrect && (
              <div className="errorTexts">
                Name needs to be at least 2 letters
              </div>
            )}
          </div>
          <div className="signItems">
            <div>Email</div>
            <input type="email" name="email" className="signItemsInputs"
              onChange={(e) => {
                setemail(e.target.value);
                setisEmailCorrect(true);
                setisEmailInUse(false);
              }}
            />
            {!isEmailCorrect && (
              <div className="errorTexts">
                Enter a valid email. must contain "@"
              </div>
            )}
            {isEmailInUse && (
              <div className="errorTexts">
                Email has already been used, login
              </div>
            )}
          </div>
          <div className="signItems">
            <div>Password</div>
            <div className="passwordDiv">
              <input
                type={viewPassword ? "text" : "password"}
                className="passwordInput"
                name="password"
                onChange={(e) => {
                  setpassword(e.target.value);
                  setisPasswordSame(true);
                  setisPasswordStrong(true);
                }}
              />
              {!viewPassword && (
                <img
                  src={openEyesIcon}
                  alt=""
                  onClick={() => setviewPassword((prev) => !prev)}
                />
              )}
              {viewPassword && (
                <img
                  src={closedEyesIcon}
                  alt=""
                  onClick={() => setviewPassword((prev) => !prev)}
                />
              )}
            </div>
            {!isPasswordSame && (
              <div className="errorTexts" id="passwordError">
                passwords do not match
              </div>
            )}
            {!isPasswordStrong && (
              <div className="errorTexts">password is too short</div>
            )}
          </div>
          <div className="signItems">
            <div>Confirm password</div>
            <div className="passwordDiv">
              <input
                type={viewPassword ? "text" : "password"}
                className="passwordInput"
                name="password"
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                  setisPasswordSame(true);
                  setisPasswordStrong(true);
                }}
              />
              {!viewPassword && (
                <img
                  src={openEyesIcon}
                  alt=""
                  onClick={() => setviewPassword((prev) => !prev)}
                />
              )}
              {viewPassword && (
                <img
                  src={closedEyesIcon}
                  alt=""
                  onClick={() => setviewPassword((prev) => !prev)}
                />
              )}
            </div>
            {!isPasswordSame && (
              <div className="errorTexts" id="passwordError">
                passwords do not match
              </div>
            )}
            {!isPasswordStrong && (
              <div className="errorTexts">password is too short</div>
            )}
          </div>
          <button className="signButton" onClick={() => register()}>
            {loading ? <span className="generalLoadingIcon"></span> : "Sign up"}
          </button>

          <p className="altText">
            Already have an account? <Link to="/login" className="hoverable">login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register