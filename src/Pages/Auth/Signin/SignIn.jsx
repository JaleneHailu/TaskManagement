import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios/axios';
import '../../../assets/Auth.css'

const SignIn = () => {
  const navigate = useNavigate(); // Use useNavigate properly
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const roleDom = useRef();
  const passwordDom = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    const usernameValue = usernameDom.current.value.trim();
    const firstnameValue = firstnameDom.current.value.trim();
    const lastnameValue = lastnameDom.current.value.trim();
    const roleValue = roleDom.current.value.trim();
    const passwordValue = passwordDom.current.value.trim();

    // Basic form validation
    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !roleValue ||
      !passwordValue
    ) {
      alert('Please provide all required information');
      return;
    }

    const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }
    const headers = {
      'Content-Type': 'application/json', // Set content type
      // Add any other headers if needed
    };

    try {
      await axios.post('/users/register', { 
        username: usernameValue,
        firstname: firstnameValue,
        lastname: lastnameValue,
        role: roleValue,
        password: passwordValue,
      }, { headers }); // Add headers here

      alert('Register successful. Please login.');
      navigate('/'); // Redirect user to login page
    } catch (error) {
      console.error('Error during registration:', error.response || error.message);
      alert(error?.response?.data?.msg);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form-container">
            <h2 className="mb-4 text-center">Avi Trust Homes</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 cont">
                <label htmlFor="user_name" className="form-label">User Name</label>
                <input
                  ref={usernameDom}
                  type="text"
                  placeholder='Username'
                />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  ref={firstnameDom}
                  type="text"
                  placeholder='First Name'
                />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  ref={lastnameDom}
                  type="text"
                  placeholder='Last Name'
                />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  ref={roleDom}
                  className="form-select"
                  defaultValue="Role">
                  <option value="Role" disabled>Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Team Member">Team Member</option>
                </select>
              </div>

              <div className="mb-3 cont">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  ref={passwordDom}
                  type="password"
                  placeholder='Password'
                />
              </div>
              <div className="submit">
                <button type="submit" className="btn btn-primary">Sign In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
