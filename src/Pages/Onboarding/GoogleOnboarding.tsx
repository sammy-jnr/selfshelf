import React, { useState, useEffect, useRef } from 'react'
import "./Onboarding.css"
import * as queryString from 'query-string';
import { loginGoogle, registerGoogle } from '../../utils/axiosCalls';
import openEyesIcon from "../../Assets/icons/openEyesIcon.svg";
import closedEyesIcon from "../../Assets/icons/closedEyesIcon.svg";
import { toast } from 'react-toastify';
import { setCookie } from '../../utils/cookies';
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { setUsername, setUserEmail, setBooksArray, setCategoriesArray } from '../../Features/MainSlice';
import { setIsLoggedIn } from '../../Features/AuthSlice';

const GoogleOnboarding = () => {

  const [isLoading, setisLoading] = useState<boolean>(false);

  const [viewPassword, setviewPassword] = useState<boolean>(false);

  const usernameRef: React.Ref<HTMLInputElement> = useRef(null)
  const passwordRef: React.Ref<HTMLInputElement> = useRef(null)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const urlParams = queryString.default.parse(window.location.search);

  useEffect(() => {
    if (window.location.pathname.startsWith("/login")) {
      login()
    }
  }, []);

  const login = () => {
    const code = urlParams.code
    if (typeof (code) !== "string") return
    setisLoading(true)
    if (isLoading) return
    loginGoogle(code)
      .then((res) => {
        const { username, email, accessToken, refreshToken, books, categories } = res.data
        setCookie("accessToken", accessToken, 1)
        setCookie("refreshToken", refreshToken, 7)
        dispatch(setUsername(username))
        dispatch(setUserEmail(email))
        dispatch(setCategoriesArray(categories))
        dispatch(setBooksArray(books))
        dispatch(setIsLoggedIn(true))
        navigate("/dashboard")
        localStorage.setItem("email", email)
        setisLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setisLoading(false)
      })
  }

  const register = () => {
    const code = urlParams.code
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (!username || !password) {
      toast("All fields are required", { type: "error" })
      return
    }
    if (typeof (code) !== "string") return
    setisLoading(true)
    if (isLoading) return
    if (window.location.pathname.startsWith("/register")) {
      registerGoogle(code, username, password)
        .then((res) => {
          const { username, email, accessToken, refreshToken } = res.data
          dispatch(setIsLoggedIn(true))
          setCookie("accessToken", accessToken, 1)
          setCookie("refreshToken", refreshToken, 7)
          dispatch(setUsername(username))
          dispatch(setUserEmail(email))
          navigate("/dashboard")
          localStorage.setItem("email", email)
          navigate("/dashboard")
          setisLoading(false)
        })
        .catch((err) => {
          console.log(err)
          navigate("/login")
          setisLoading(false)
          toast("An error occurred, try again", { type: "error" })
        })
    }
  }


  if (isLoading) return <div className='onboardingLoadingDiv'><span className="generalLoadingIconLarge"></span></div>
  return (
    <div className='onboardingContainer'>
      <div className='onboardingInner'>
        <h1>Register</h1>
        <div className="onboardingItems">
          <p>Username</p>
          <input type="text" name='name' ref={usernameRef} />
        </div>
        <div className="onboardingItemPassword">
          <p>Password</p>
          <div>
            <input type={viewPassword ? "text" : "password"} name='password' ref={passwordRef} />
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
        </div>
        <button onClick={register}>Continue</button>
      </div>
    </div>
  )
}

export default GoogleOnboarding