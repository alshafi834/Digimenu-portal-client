import React, { useContext } from "react";

import "./Navlink.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const Navlinks = () => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      {/* <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li> */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/users" exact>
            My restaurant
          </NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/">Register</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default Navlinks;
