import React, { useState, useEffect } from "react";
import "../../../assets/Table.css";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Axios/Axios";
import Header from "../../../components/Header/Header";
import NavigationIcons from "../../../components/NavigationIcons/NavigationIcons";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const navigate = useNavigate();

  // Fetch all projects from the API
  const fetchProjects = async () => {
    try {
      const response = await axios.get("/projects/allProjects");
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
      setError("An error occurred while fetching projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`/projects/${projectId}`);
        setProjects(projects.filter((project) => project.uniqueProjectId !== projectId));
        alert("Project deleted successfully");
      } catch (error) {
        console.error("Failed to delete project:", error.message);
        alert("An error occurred while deleting the project.");
      }
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/editProject/${projectId}`);
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
                  {project.projectname}
                </div>
                <div className="teamicons" style={{ display: "flex", gap: "10px" }}>
                  <MdEdit onClick={() => handleEdit(project.uniqueProjectId)} style={{ cursor: "pointer" }} />
                  <MdDelete onClick={() => handleDelete(project.uniqueProjectId)} style={{ cursor: "pointer" }} />
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
        <Link to={"/register"} className="btn btn-primary">Add Project</Link>
      </div>
    </div>
  );
};

export default Projects;
