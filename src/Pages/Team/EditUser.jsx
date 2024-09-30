import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axios/axios';

const EditUser = () => {
  const { userid } = useParams();
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    role: '',
    password: '', // Add password field
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const fullURL = `/users/user/${userid}`;
        console.log('Fetching user with URL:', fullURL);
        const { data } = await axios.get(fullURL, { headers }); // Add headers
        setUserData(data); // Populate form with fetched user data
        console.log('Fetched user data:', data);
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
      }
    };
    
    if (userid) {
      fetchUser(); // Only fetch if userid is defined
    } else {
      console.error("No userid provided in the route.");
    }
  }, [userid]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found.');

    const headers = { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    };

    // Prepare data for update, only include fields that are not empty
    const updatedData = {
      username: userData.username || undefined,
      firstname: userData.firstname || undefined,
      lastname: userData.lastname || undefined,
      role: userData.role || undefined,
      user_password: userData.password ? userData.password : undefined // Send password only if provided
    };

    // Filter out undefined fields to avoid sending them in the request
    const payload = Object.fromEntries(
      Object.entries(updatedData).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(payload).length === 0) {
      console.error("No fields to update.");
      return;
    }

    try {
      await axios.put(`/users/edit/${userid}`, payload, { headers }); // Correct order of parameters
      navigate('/team');
    } catch (error) {
      console.error("Failed to update user:", error.message);
      navigate('/team');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-container">
            <h2 className="mb-4 text-center">Avi Trust Homes</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 cont">
                <label htmlFor="username" className="form-label">User Name</label>
                <input
                  type="text"
                  name="username"
                  placeholder={userData.username || "Enter user name"}
                  value={userData.username}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="firstname" className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  placeholder={userData.firstname || "Enter first name"}
                  value={userData.firstname}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="lastname" className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  placeholder={userData.lastname || "Enter last name"}
                  value={userData.lastname}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="" disabled>Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Team Member">Team Member</option>
                </select>
              </div>
              <div className="mb-3 cont">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={userData.password}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="submit">
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
