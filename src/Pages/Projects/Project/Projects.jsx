import React, { useState, useEffect } from "react";
import "../../../assets/Table.css";
import { MdDelete, MdEdit, MdSave, MdCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios/axios";
import Header from "../../../components/Header/Header";
import NavigationIcons from "../../../components/NavigationIcons/NavigationIcons";
import {jwtDecode as jwt_decode} from 'jwt-decode';
  // Explicit named import for default

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [editProjectId, setEditProjectId] = useState(null); // Track which project is being edited
  const [editedProjectName, setEditedProjectName] = useState(""); // Store the edited project name
  const [userRole, setUserRole] = useState(""); // Track user role
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/projects/allProjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError("An error occurred while fetching projects. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      // const decoded = jwt_decode(token);
      setUserRole(decodedToken.role); // Assuming the token contains 'role'
    }
    fetchProjects();
  }, []);

  // Handle the delete operation
  const handleDelete = async (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/projects/deleteProject/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Project deleted successfully!");
      fetchProjects(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting project:", error.message);
      alert("Failed to delete the project. Please try again.");
    }
  };

  // Enable edit mode for a specific project
  const handleEdit = (projectId, projectName) => {
    setEditProjectId(projectId);
    setEditedProjectName(projectName);
  };

  // Handle the project name change in edit mode
  const handleInputChange = (e) => {
    setEditedProjectName(e.target.value);
  };

  // Save the edited project name
  const handleSave = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/projects/updateProject/${projectId}`, 
        { projectName: editedProjectName }, // Send updated project name
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Project updated successfully!");
      setEditProjectId(null); // Exit edit mode
      fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error("Error updating project:", error.message);
      alert("Failed to update the project. Please try again.");
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditProjectId(null);
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="projectWrapper">
      <Header />
      <NavigationIcons />
      <div className="team">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.uniqueProjectId}>
              <div className="userTable">
                <div
                  className="name_and_task"
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {editProjectId === project.uniqueProjectId ? (
                    <input
                      type="text"
                      value={editedProjectName}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    <Link className="text-light no-underline-link" to={`/${project.projectid}/tasks`}>
                      {project.projectname}
                    </Link>
                  )}
                </div>
                <div className="teamicons" style={{ display: "flex", gap: "10px" }}>
                  {editProjectId === project.uniqueProjectId ? (
                    <>
                      <MdSave
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => handleSave(project.uniqueProjectId)}
                      />
                      <MdCancel
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={handleCancel}
                      />
                    </>
                  ) : (
                    <>
                      {(userRole === "Admin" || userRole === "Team Leader") && (
                        <>
                          <MdEdit
                            style={{ color: "white", cursor: "pointer" }}
                            onClick={() => handleEdit(project.uniqueProjectId, project.projectname)}
                          />
                          <MdDelete
                            style={{ color: "white", cursor: "pointer" }}
                            onClick={() => handleDelete(project.uniqueProjectId)}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
        {(userRole === "Admin" || userRole === "Team Leader") && (
          <Link to={"/createProject"} className="btn btn-primary">
            Add Project
          </Link>
        )}
      </div>
    </div>
  );
};

export default Projects;
