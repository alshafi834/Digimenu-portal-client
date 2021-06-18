import React from "react";

import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import Navlinks from "./Navlinks";

const MainNavigation = (props) => {
  return (
    <MainHeader>
      <h2 className="main-navigation__title">
        <Link to="/">Restaurant Menu Portal</Link>
      </h2>
      <nav>
        <Navlinks />
      </nav>
    </MainHeader>
  );
};

export default MainNavigation;
