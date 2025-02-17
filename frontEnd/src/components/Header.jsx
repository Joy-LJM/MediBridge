import logo from "../assets/logo.png"; 
import '../styles/header.css';
import PropTypes from "prop-types";
export default function Header({ children }) {
  return (
   
      <header>
        <div className="left">
        <img src={logo} alt="Logo" />
        <div>
          <h2>MediBridge </h2>
          <p> Connecting convenient care for everyone</p>
        </div>
        </div>
        {children}
      </header>
   
  );
}

Header.propTypes = {
  children: PropTypes.node,
};
