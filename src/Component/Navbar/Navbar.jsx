import React from "react";
import './navbar.css'

function Navbar(props) {
  const {
    title = "",
    renderRight = () => null,
  } = props;


  return (
    <div className="navbar">
        <div className="navbar-left">
        </div>
        <div className="navbar-right">
        {renderRight() ? <div className="navbar-right">{renderRight()}</div> : null}
        </div>
    </div>
  );
}
export default Navbar;