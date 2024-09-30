import React from "react";
import "./Header.css";
// import man from "../../assets/man.png";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from local storage (or session storage)
    localStorage.removeItem('token');
    
    // Optionally, you can clear other user data from storage
    localStorage.removeItem('userRole');
  
    // Redirect the user to the login page or home page
    navigate('/'); // Assuming you use `useNavigate` from react-router
  };
  
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
      <div style={{alignContent: "center"}} className="imgWrapper">
        <div>
        <button
        style={{backgroundColor: "#343a40", border: "none"}}
        onClick={handleLogout} 
        className="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
