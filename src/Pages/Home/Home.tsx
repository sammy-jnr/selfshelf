import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homeContainer">
      <h2 className="siteName">Self shelf</h2>
      <section className="mainSection">
        <h1>
          Welcome to the best online book catalogue
        </h1>
        <p>Catalogue and organize your books in the best way possible</p>
        <p className="mainSectionSecondP">It is free and easy to use</p>
        <Link to={"/dashboard"}>
          <button>Get started</button>
        </Link>
      </section>
    </div>
  );
}

export default Home;
