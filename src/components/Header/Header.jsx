import React from "react";
import "./Header.css";
import man from "../../assets/man.png";

const Header = () => {
  return (
    <div className="upperWrapper">
      <div className="pWrapper">
        <div>
          <h4>Welcome back, John Doe</h4>
        </div>
        <div>
          <h1>Avi Trust Homes</h1>
        </div>
      </div>
      <div className="imgWrapper">
        <div>
          <img src={man} alt="Profile" className="circle-image" />
        </div>
      </div>
    </div>
  );
};

export default Header;
