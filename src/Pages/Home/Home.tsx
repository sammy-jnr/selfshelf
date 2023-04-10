import React from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store"
import { useDispatch, useSelector } from "react-redux"
import logo from "../../Assets/images/logo.png"

function Home() {
  const store = useSelector((store: RootState) => store)
  const isLoading = store.auth.initialLoading
  const isLoggedIn = store.auth.isLoggedIn

  const navigate = useNavigate()


  return (
    <div className="homeContainer">
      <h2 className="siteName">Self shelf</h2>
      <section className="mainSection">
        <h1>
          Welcome to the best online personal library
        </h1>
        <p>Store and organize your books for free in the best way possible</p>
        <Link to={"/dashboard"}>
          <button
            onClick={() => {
              if (isLoading) return
              isLoggedIn ? navigate("/dashboard") : navigate("/register")
            }}
          >
            {
              isLoading
                ?
                <span className="generalLoadingIcon"></span>
                :
                isLoggedIn
                  ?
                  "Dashboard"
                  :
                  "Get started"
            }
          </button>
        </Link>
      </section>
    </div>
  );
}

export default Home;
