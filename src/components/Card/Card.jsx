import React from "react";
import "./Card.css";
import "./circle.css"
import "./circle"
import { AppState } from "../../App";
import { useContext } from "react";

const Card = () => {

  const {user} = useContext(AppState)

  return (
    <div className="cardHolder">
      <div>
        <h3>Welcome back, {user.username}</h3>
      </div>
      <div className="cardWrapper">
        <div className="projectName"><h2>Task Management System</h2></div>
        <div className="lowerCard">
          {/* <div className="listWrapper">
          <ul>
              <li>3 tasks Completed</li>
              <li>3 tasks on Progress</li>
              <li>2 tasks stuck</li>
            </ul>
          </div> */}
          <div>
            <p className="percentage">
          Effortlessly manage your tasks and projects with this platform. Stay organized, prioritize effectively, and collaborate seamlessly with your team.
        </p>
          </div>
        </div>
        <div className="spinner-container">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    </div>
  );
};

export default Card;

