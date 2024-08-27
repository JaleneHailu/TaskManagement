import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../Axios/Axios';  // Ensure the correct path to your axios instance
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const projectnameDom = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    let projectnameValue = projectnameDom.current.value.trim();

    console.log('Project Name Entered:', projectnameValue);

    // Front-end validation for empty project name
    if (!projectnameValue || projectnameValue.length < 3) {  // Example: Minimum length of 3
      alert('Please provide a valid project name (minimum 3 characters).');
      return;
    }

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('You are not logged in. Please log in and try again.');
      navigate('/'); // Redirect to login if token is missing
      return;
    }

    try {
      const { data } = await axios.post('/projects/createProject', 
        { 
          projectName: projectnameValue,  // Make sure the key matches the server-side code (case-sensitive)
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Send token in request
          }
        }
      );
  
      alert('Project created successfully.');
      navigate('/project'); // Redirect to the project page after creation
    } catch (error) {
      console.error('Error during project creation:', error.response?.data || error.message || error);
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
      if (error.response?.status === 401) {
        navigate('/'); // Redirect to login if unauthorized
      }
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-container">
            <h2 className="mb-4 text-center">Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 cont">
                <label htmlFor="projectName" className="form-label">Project Name</label>
                <input 
                  ref={projectnameDom}
                  type="text" 
                  id="projectName" 
                  name="projectName" 
                  className="form-control"  // Added Bootstrap class for styling
                  required 
                />
              </div>
              <div className="d-flex justify-content-between">
                <Link to="/project" className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
