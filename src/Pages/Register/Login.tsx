import { useState } from "react";
import openEyesIcon from "../../Assets/icons/openEyesIcon.svg";
import closedEyesIcon from "../../Assets/icons/closedEyesIcon.svg";
import googleIcon from "../../Assets/icons/googleIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import { loginDB } from "../../utils/axiosCalls";
import "./Sign.css"
import { setCookie } from "../../utils/cookies";
import { setBooksArray, setCategoriesArray, setUsername, setUserEmail } from "../../Features/MainSlice";
import { useDispatch } from "react-redux"
import { setIsLoggedIn } from "../../Features/AuthSlice";
import { googleLoginUrl } from "../../utils/google";


const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [viewPassword, setviewPassword] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const [isUserRegistered, setisUserRegistered] = useState(true);
  const [isPasswordCorrect, setisPasswordCorrect] = useState(true);

  const [loading, setloading] = useState<boolean>(false);

  const login = (email: string, password: string) => {
    if (email.length < 3) return
    setloading(true)
    loginDB(email, password)
      .then((res) => {
        const response = res.data
        setCookie("accessToken", response.accessToken, 1)
        setCookie("refreshToken", response.refreshToken, 7)
        dispatch(setUsername(response.username))
        dispatch(setUserEmail(email))
        dispatch(setCategoriesArray(response.categories))
        dispatch(setBooksArray(response.books))
        dispatch(setIsLoggedIn(true))
        navigate("/dashboard")
        localStorage.setItem("email", email)
        setloading(false)
      })
      .catch((error) => {
        setloading(false)
        if (error.response.data === "Couldn't find user") {
          setisUserRegistered(false)
        } else if (error.response.data === "Incorrect password") {
          setisUserRegistered(false)
        } else {
          setisPasswordCorrect(false)
        }
      })
  }

  return (
    <div className="SignContainer">
      <div className="signContainer1">
        <div className="signContainer1Inner">
          <h2>Login to your account</h2>
          <div>
            <p>Don't have an account?</p>
            <Link to={"/register"} className="hoverable"><button className="signLButton">Register</button></Link>
          </div>
        </div>
      </div>
      <div className="signContainer2">
        <div className="signContainer2Inner">
          <p className="signContainer2InnerT">Login</p>
          <Link to={googleLoginUrl} className="link hoverable">
            <div className="signWithGoogle" onClick={() => { }}>
              <img src={googleIcon} alt="" id="googleIcon" />
              <p>Login with google</p>
            </div>
          </Link>
          <div className="orDiv">or</div>
          <div className="signItems">
            <div>Email</div>
            <input type="email" className="signItemsInputs" name="email" onChange={(e) => { setEmail(e.target.value) }} />
            {!isUserRegistered && <div className="errorTexts">User not found</div>}
          </div>
          <div className="signItems">
            <div>Password</div>
            <div className="passwordDiv">
              <input
                type={viewPassword ? "text" : "password"}
                className="passwordInput"
                name="password"
                onChange={(e) => { setPassword(e.target.value) }}
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
            {!isPasswordCorrect && <div className="errorTexts">Incorrect password</div>}
          </div>
          <button className="signButton" onClick={() => login(email, password)}>
            {loading ? <span className="generalLoadingIcon"></span> : "Sign in"}
          </button>
          <p className="altText">Don't have an account? <Link to="/register" className="hoverable">Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login