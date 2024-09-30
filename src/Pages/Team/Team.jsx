import React, { useState, useEffect } from "react";
import "../../assets/Table.css";
import { MdDelete, MdEdit } from "react-icons/md";
import Header from "../../components/Header/Header";
import NavigationIcons from "../../components/NavigationIcons/NavigationIcons";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios/axios";
import {jwtDecode as jwt_decode} from 'jwt-decode';


const Team = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(""); // Track user role


  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.get("/users/all", { headers }); // Add headers
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle editing a user
  const handleEdit = (userid) => {
    navigate(`/edit/${userid}`);
  };

  // Function to handle deleting a user
  const handleDelete = async (userid) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        await axios.delete(`/users/delete/${userid}`, { headers }); // Add headers
        setUsers(users.filter(user => user.userid !== userid)); // Remove the deleted user from the list
      } catch (error) {
        console.error("Failed to delete user:", error.message);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role); // Assuming the token contains 'role'
    }
  }, []);

  return (
    <div>
      <div className="projectWrapper">
        <Header />
        <NavigationIcons />
        <div className="team">
          {users.map((user, index) => (
            <div key={index}>
              <div className="userTable">
                <div
                  className="name_and_task"
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {user.firstname} {user.lastname}
                </div>
                <div className="name">{user.role}</div>

                
                {userRole === 'Admin' || userRole === 'Team Leader' ? (
                
                <div className="teamicons" style={{ display: "block" }}>
                  <MdEdit
                    style={{ color: "white !important", marginRight: "80px" }}
                    onClick={() => handleEdit(user.userid)} // Handle edit click
                  /> 
                  <MdDelete
                    style={{ color: "white !important" }}
                    onClick={() => handleDelete(user.userid)} // Handle delete click
                  />
                </div>

                ) : null}

              </div>
              <hr />
            </div>
          ))}
          <Link to={"/register"}>Add</Link>
        </div>
      </div>
    </div>
  );
};

export default Team;
