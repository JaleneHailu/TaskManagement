import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axios/axios';
import '../../../assets/Auth.css'

const Login = () => {
  const navigate = useNavigate(); 
  const usernameDom = useRef();
  const passwordDom = useRef();


  async function handleSubmit(e) {
    e.preventDefault();

    const usernameValue = usernameDom.current.value.trim();
    const passwordValue = passwordDom.current.value.trim();

    // Basic form validation
    if (
      !usernameValue ||
      !passwordValue
    ) {
      alert('Please provide all required information');
      return;
    }

    try {
      const {data} = await axios.post('/users/login', { 
        username: usernameValue,
        password: passwordValue,
      });

      alert('Login successful.');
      localStorage.setItem('token', data.token);
      // When user logs in and you receive the user's details from the backend
      localStorage.setItem('firstname', data.firstname);
      localStorage.setItem('lastname', data.lastname);

      navigate('/home');
      console.log(data);
    } catch (error) {
      console.error('Error during login:', error.response || error.message);
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
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  ref={passwordDom}
                  type="password"
                  placeholder='Password'
                />
              </div>
              <div className="submit">
                <button type="submit" className="btn btn-primary">Login In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login

