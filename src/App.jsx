import './App.css'
import { useNavigate } from 'react-router-dom';
import MainSec from './Pages/Main/Main'
import { Routes, Route } from "react-router-dom";
import CreateProject from './Pages/Projects/CreateProject/CreateProject';
import Team from './Pages/Team/Team';
import Projects from './Pages/Projects/Project/Projects';
import SignIn from './Pages/Auth/Signin/SignIn';
import Login from './Pages/Auth/Login/Auth';
import { useEffect, useState, createContext } from 'react';
// import { checkUser } from '../../Server/controller/userConroller';
import axios from './axios/axios';
import EditUser from './Pages/Team/EditUser';
import TaskTable from './components/TaskTable/TaskTable';
import CreateTask from './components/TaskTable/CreateTask';
import SingleTask from './components/TaskTable/singleTask';

export const AppState = createContext()

function App() {
  const [user, setuser] = useState({})
  
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  async function checkUser() {
    try{
      const {data} = await axios.get('/users/checkUser', {
        headers:{
          Authorization: 'Bearer ' + token,
        }
      })
      setuser(data)
      console.log(data);
    }
    catch(error){
      console.log(error.response);
      navigate('/')
    }
  }

  useEffect(() => {
    checkUser();
  }, []) 
  return (
    <AppState.Provider value={{user,setuser}}>
    <Routes>
        <Route path='/register' element={<SignIn />} />
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<MainSec/>} />
        <Route path='/createProject' element={<CreateProject />} />
        <Route path='/team' element={<Team />} />
        <Route path='/:projectId/tasks' element={<TaskTable />} />
        <Route path='/:projectId/tasks/:taskId/task' element={<SingleTask />} />
        <Route path='/:projectId/createTask' element={<CreateTask />} />
        <Route path='/project' element={<Projects />} />
        <Route path='/edit/:userid' element={<EditUser />} />
    </Routes>
    </AppState.Provider>
  )
}

export default App
