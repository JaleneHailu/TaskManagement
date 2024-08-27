import React, { useState } from "react";
import "../../assets/Table.css";
import fileIcon from "../../assets/menu-dots.png";
import { IoIosAddCircle } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskTable = () => {
  // Define the table items first
  const tableItems = [
    { taskname: "BackEnd Deployment", ownername: "Abebe Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "Database Table", ownername: "Abebech Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "BackEnd Deployment", ownername: "Abebe Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "Database Table", ownername: "Abebech Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "BackEnd Deployment", ownername: "Abebe Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "Database Table", ownername: "Abebech Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "BackEnd Deployment", ownername: "Abebe Feleke", date: "12/04/24", file: fileIcon },
    { taskname: "Database Table", ownername: "Abebech Feleke", date: "12/04/24", file: fileIcon },
  ];

  // Initialize state to store date for each task
  const [dates, setDates] = useState(
    tableItems.reduce((acc, item, index) => ({
      ...acc,
      [index]: new Date(item.date) // Convert string date to Date object
    }), {})
  );

  // Handler for updating the date
  const handleDateChange = (date, index) => {
    setDates((prevDates) => ({
      ...prevDates,
      [index]: date
    }));
  };

  const [priorityColors, setPriorityColors] = useState({});
  const [statusColors, setStatusColors] = useState({});

  const updateColor = (e, index, setColor) => {
    const value = e.target.value;
    let color;

    switch (value) {
      case "high":
        color = "#F55E00";
        break;
      case "medium":
        color = "#FF9A5C";
        break;
      case "low":
        color = "#FFCDAD";
        break;
      case "delivered":
        color = "#6fa126";
        break;
      case "onProgress":
        color = "#ffde59";
        break;
      case "stuck":
        color = "#df5453";
        break;
      default:
        color = "grey";
    }

    setColor((prevColors) => ({
      ...prevColors,
      [index]: color,
    }));
  };

  return (
    <div className="tableWrapper">
      <div className="search">
        <div className="searchBox">Search
          <CiSearch style={{ fontSize: "20px" }} />
        </div>
      </div>
      <div className="addTask">
        <div className="Add">Add Task<IoIosAddCircle className="addIcon" /></div>
        <div className="sort">Sort by
          <select name="" id="">
            <option value="Latest"><b>Latest</b></option>
            <option value="Alphabet">Alphabet</option>
          </select>
        </div>
      </div>
      {tableItems.map((item, index) => (
        <div key={index}>
          <div className="customTable">
            <div className="name_and_task">
              <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "5px" }}>
                {item.taskname}
              </div>
              <div style={{ fontWeight: "lighter", fontSize: "13px" }}>
                {item.ownername}
              </div>
            </div>
            <div className="priority custom-select">
              <select
                id={`prioritySelect${index}`}
                onChange={(e) => updateColor(e, index, setPriorityColors)}
                style={{ color: priorityColors[index] || "grey" }}
                defaultValue=""
              >
                <option value="" className="default-option">Priority</option>
                <option style={{ color: "#F55E00" }} value="high">High</option>
                <option style={{ color: "#FF9A5C" }} value="medium">Medium</option>
                <option style={{ color: "#FFCDAD" }} value="low">Low</option>
              </select>
            </div>
            <div>
              <DatePicker
                className="date"
                selected={dates[index]}
                onChange={(date) => handleDateChange(date, index)}
                dateFormat="MMMM d, yyyy"
              />
            </div>
            <div className="status custom-select">
              <select
                id={`statusSelect${index}`}
                onChange={(e) => updateColor(e, index, setStatusColors)}
                style={{ color: statusColors[index] || "grey" }}
                defaultValue=""
              >
                <option value="" className="default-option">Status</option>
                <option style={{ color: "#6fa126" }} value="delivered">Delivered</option>
                <option style={{ color: "#ffde59" }} value="onProgress">On Progress</option>
                <option style={{ color: "#df5453" }} value="stuck">Stuck</option>
              </select>
            </div>
            <div className="file">
              <img src={item.file} alt="file icon" />
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
