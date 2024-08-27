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
        <div className="projectName"><h2>Evan Project</h2></div>
        <div className="lowerCard">
          <div className="listWrapper">
          <ul>
              <li>3 tasks Completed</li>
              <li>3 tasks on Progress</li>
              <li>2 tasks stuck</li>
            </ul>
          </div>
          <div>
            <p className="percentage">
          <b>Your Team was 50% Effective this week</b>
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
