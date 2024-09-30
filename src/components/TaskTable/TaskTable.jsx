import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "../../assets/Table.css";
import fileIcon from "../../assets/menu-dots.png";
import { IoIosAddCircle } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for backend requests
import Header from "../Header/Header";
import NavigationIcons from "../NavigationIcons/NavigationIcons";
import {jwtDecode as jwt_decode} from 'jwt-decode';


const TaskTable = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [owners, setOwners] = useState([]);
  const [priorityColors, setPriorityColors] = useState({});
  const [statusColors, setStatusColors] = useState({});
  const [userRole, setUserRole] = useState(""); // Track user role


  // Fetch tasks and owners when the component mounts
  useEffect(() => {
    const fetchTasksAndOwners = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        const taskResponse = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks`, { headers });
        if (!taskResponse.ok) throw new Error(`Error fetching tasks: ${taskResponse.statusText}`);
        const taskData = await taskResponse.json();

        const ownerResponse = await fetch('http://localhost:3000/api/users/all', { headers });
        if (!ownerResponse.ok) throw new Error(`Error fetching owners: ${ownerResponse.statusText}`);
        const ownerData = await ownerResponse.json();

        const tasksWithDates = taskData.map(task => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        }));
        setTasks(tasksWithDates);
        setOwners(ownerData);
      } catch (error) {
        console.error('Error fetching tasks or owners:', error);
        setTasks([]);
        setOwners([]);
      }
    };

    fetchTasksAndOwners();
  }, [projectId]);

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#F55E00";
      case "medium": return "#FF9A5C";
      case "low": return "#FFCDAD";
      default: return "grey";
    }
  };

  const getOwnerName = (ownerId) => {
    const owner = owners.find((owner) => owner.userid === ownerId);
  
    if (owner) {
      // Assuming 'firstname' and 'lastname' are added in the owner data structure
      return `${owner.firstname} ${owner.lastname}`;
    } else {
      console.warn(`Owner with ID ${ownerId} not found.`);
      return "Unknown Owner";
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#6fa126";
      case "pending": return "#ffde59";
      case "stuck": return "#df5453";
      default: return "grey";
    }
  };

  // Handle date change
  const handleDateChange = (date, index) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[index].dueDate = date;
      return newTasks;
    });
  };

  // Handle status change
  const handleStatusChange = async (e, index, taskId) => {
    const newStatus = e.target.value;
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index].status = newStatus;
      return updatedTasks;
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');
      
      await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/task/updateStatus/${taskId}`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      // const decoded = jwt_decode(token);
      setUserRole(decodedToken.role); // Assuming the token contains 'role'
    }
  }, []);

  const getCurrentUserId = () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      return decodedToken.userid; // 'userid' field in the token payload (depends on how your token is structured)
    }
    return null;
  };
  const currentUserId = getCurrentUserId();
  console.log(currentUserId);

  return (
    <>
    
    
    <Header />
    <NavigationIcons />
    <div className="container">
      <div className="tableWrapper">
        {/* <div className="search">
          <div className="searchBox">
            Search <CiSearch style={{ fontSize: "20px" }} />
          </div>
        </div> */}
        <div className="addTask">
          <div className="Add">
          {(userRole === "Admin" || userRole === "Team Leader") && (
            <Link className="text-light no-underline-link" to={`/${projectId}/createTask`}>
              Add Task <IoIosAddCircle className="addIcon" />
            </Link>)}
          </div>
          {/* <div className="sort">Sort by
            <select name="" id="">
              <option value="Latest"><b>Latest</b></option>
              <option value="Alphabet">Alphabet</option>
            </select>
          </div> */}
        </div>
        {tasks.map((task, index) => (
          <div key={index}>
            <div className="customTable">
              <div className="name_and_task">
                <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "5px" }}>
                  <Link className="text-light no-underline-link" to={`/${projectId}/tasks/${task.id}/task`}>{task.taskname}</Link>
                </div>
                <div style={{ fontWeight: "lighter", fontSize: "13px" }}>
                {getOwnerName(task.userid)}
                </div>
              </div>

              <div className="priority" style={{ color: getPriorityColor(task.priority) }}>
                {task.priority}
              </div>
              {task.dueDate}
              <div className="date">
                {task.due_date ? format(task.due_date, 'MMMM d, yyyy') : (
                  <DatePicker
                    className="datePicker"
                    selected={task.dueDate}
                    onChange={(date) => handleDateChange(date, index)}
                    dateFormat="MMMM d, yyyy"
                    popperPlacement="bottom-end"
                    placeholderText="Due date"
                  />
                )}
              </div>
              <div className="status custom-select" style={{ color: getStatusColor(task.status) }}>
                <select
                    value={task.status || ""}
                    onChange={(e) => handleStatusChange(e, index, task.id)}
                    style={{ color: getStatusColor(task.status) }}
                    disabled={currentUserId !== task.userid} // Enable only for task owner
                  >
                    <option value="">Status</option>
                    <option value="completed" style={{ color: "#6fa126" }}>Delivered</option>
                    <option value="pending" style={{ color: "#ffde59" }}>On Progress</option>
                    <option value="stuck" style={{ color: "#df5453" }}>Stuck</option>
                </select>

</div>


              <div className="file">
                <img src={fileIcon} alt="file icon" />
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
    </>   
  );
};

export default TaskTable;
