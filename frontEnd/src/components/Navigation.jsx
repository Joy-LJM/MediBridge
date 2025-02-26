import { NavLink } from "react-router-dom";
import "../styles/Navigation.css";
import PropTypes from "prop-types";

export default function Navigation({isLogin}) {

  return (
    <div id="nav">
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        {isLogin && <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {/* <Dashboard/> */}
            Dashboard
          </NavLink>
        </li>}
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

Navigation.propTypes={
  isLogin:PropTypes.string
}
