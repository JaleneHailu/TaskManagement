import React from "react";
import "./NavigationIcons.css";
import { MdHome } from "react-icons/md";
import { FaRegBuilding, FaUsersLine } from "react-icons/fa6";
import { GrTask } from "react-icons/gr";
import { Link } from "react-router-dom";

const NavigationIcons = () => {
  return (
    <div className="iconsWrapper">
      <ul>
        <Link to="/home" className="no-underline-link">
        <li>
          <div className="icons">
           <MdHome className="icon"  />
            <div className="p">
              <p>Home</p>
            </div>
          </div>
        </li>
        </Link>
        <Link to="/project" className="no-underline-link" >
        <li>
          <div className="icons">
            <FaRegBuilding className="icon" />
            <div className="p">
              <p>Projects</p>
            </div>
          </div>
        </li>
        </Link>
        <li>
          <div className="icons">
            <GrTask className="icon" />
            <div className="p">
              <p>Tasks</p>
            </div>
          </div>
        </li>
        <Link to="/team" className="no-underline-link">
        <li>
          <div className="icons">
            <FaUsersLine className="icon" />
            <div className="p">
              <p>My Team</p>
            </div>
          </div>
        </li>
        </Link>
      </ul>
    </div>
  );
};

export default NavigationIcons;
