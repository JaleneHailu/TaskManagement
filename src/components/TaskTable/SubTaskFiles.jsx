import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './singleTask.css';
import { Link } from 'react-router-dom';
import axios from "../../axios/axios";
import { IoMdDownload } from "react-icons/io";
import {jwtDecode as jwt_decode} from 'jwt-decode';
import { FaFilePdf, FaCommentDots, FaCloudUploadAlt  } from "react-icons/fa";



const SingleTask = () => {
  const { taskId, projectId } = useParams(); // Get taskId and projectId from URL
  const [task, setTask] = useState(null); // State to store the task data
  const [loading, setLoading] = useState(true); // State to show loading status
  const [error, setError] = useState(null); // State to store any errors
  const [editMode, setEditMode] = useState(false); // State for toggling edit mode
  const [formData, setFormData] = useState({}); // State for handling form data
  const [owners, setOwners] = useState([]); // State to store the owners
  const [files, setFiles] = useState(null); // New state for the file
  const navigate = useNavigate();
  const fileInputDom = useRef(); // New ref for file upload
  const [subtaskFormData, setSubtaskFormData] = useState({
    subtaskname: '',
  });  
  const [subtask, setSubtasks] = useState([]);
  const [userRole, setUserRole] = useState(""); // Track user role
  

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.get(`/projects/${projectId}/task/${taskId}`, { headers });
        setTask(response.data.task); // Properly set task data
        setFormData(response.data.task); // Initialize form data with task details
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, projectId]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.get('/users/all', { headers });
        setOwners(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          
         throw new Error('No authentication token found.');
        }


        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.get(`/${taskId}/files`, { headers });
        setFiles(response.data.files);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchFiles();
  }, [taskId]);

  useEffect(() => {
    if (task) {
      setFormData({
        taskname: task.taskname || '',
        userid: task.userid || '',
        starting_date: task.starting_date || '',
        due_date: task.due_date || '',
        priority: task.priority || '',
        status: task.status || '',
        note: task.note || '',
      });
    }
  }, [task, editMode]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const deleteTask = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      await axios.delete(`/projects/${projectId}/task/${taskId}`, { headers });
      navigate(`/${projectId}/tasks`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const editTask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const formattedData = {
        ...formData,
        starting_date: formData.starting_date ? new Date(formData.starting_date).toISOString().split('T')[0] : null,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : null,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.patch(`/projects/${projectId}/task/${taskId}`, formattedData, { headers });
      setTask(response.data.task);
      setEditMode(false);
      alert('Task updated successfully!');
      navigate(`/${projectId}/tasks`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const getOwnerName = (ownerId) => {
    const owner = owners.find((owner) => owner.userid === ownerId);
    return owner ? `${owner.firstname} ${owner.lastname}` : "Unknown Owner";
  };

  const handleFileDownload = async (fileId, filename) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to download files.');
      return;
    }

    try {
      const response = await axios.get(`/download/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // This is required for downloading files
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFileUpload = async (file, subtaskid) => {
    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }
  
      // No need to set Content-Type; browser sets it to 'multipart/form-data'
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(`/upload/sub${subtaskid}`, formData, { headers });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const handleSaveUploads = async (file, subtaskid) => {
    await handleFileUpload(file, subtaskid); // Pass the file and subtask ID
  };

  const handleSaveChanges = async () => {
    await editTask();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role); // Assuming the token contains 'role'
    }
  }, []);

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }
  
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
  
        const response = await axios.get(`/projects/${projectId}/task/${taskId}/subtasks`, { headers });
        
        // Debugging: Check if data exists in the response
        console.log('Response data:', response.data);
  
        // Safely update state only if data is valid
        setSubtasks(Array.isArray(response.data.subtask) ? response.data.subtask : []);
  
      } catch (err) {
        console.error('Error fetching subtasks:', err.message);
      }
    };
  
    // Ensure `taskId` and `projectId` exist before fetching
    if (taskId && projectId) {
      fetchSubtasks();
    }
  }, [taskId, projectId]);
  
  const createSubtask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await axios.post(`/projects/${projectId}/task/${taskId}/subtasks`, subtaskFormData, { headers });
      alert('Subtask created successfully!');
      setSubtaskFormData({ subtaskname: '' }); // Reset the form
      await fetchSubtasks(); // Fetch the updated list of subtasks after creation
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleSubtaskInputChange = (e) => {
    setSubtaskFormData({
      ...subtaskFormData,
      [e.target.name]: e.target.value,
    });
  };
  
  
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!task) return <div>No task found with ID: {taskId}</div>;


  return (
    <>
    <div>
      <div className="card bg-dark text-light shadow-lg p-4">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Task Details</h2>

          {!editMode ? (
            <>
            
      <section className="intro">
  <div className="gradient-custom-2 h-100 mb-5">
    <div className="mask d-flex h-100">
      <div className="container">
        <div className="row ">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-dark table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">Task Name</th>
                    <th scope="col">Task Owner</th>
                    <th scope="col">Starting Date</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Status</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{task.taskname || 'Unknown'}</th>
                    <td> {getOwnerName(task.userid)}</td>
                    <td>{task.starting_date ? format(new Date(task.starting_date), 'MMMM d, yyyy') : 'Unknown'}</td>
                    <td>{task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'Unknown'}</td>
                    <td>{task.priority || 'Unknown'}</td>
                    <td>{task.status || 'Unknown'}</td>
                    <td>{task.note || 'No notes available'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div className="mt-4 container">
  <div className="d-flex" 
      style={{width: "50%"}}>
    {/* <label htmlFor="subtaskname ms-3">Subtask Name</label> */}
    <input
      type="text"
      className="mb-3 ps-3"
      name="subtaskname"
      placeholder='Subtask Name'
      value={subtaskFormData.subtaskname}
      onChange={handleSubtaskInputChange}
    />
      <button className="btn btn-primary ms-3 mb-3" style={{width: "50%"}} onClick={createSubtask}>Create Subtask</button>
  </div>
</div>
{/* <h5>Subtasks:</h5> */}
<section className="intro">
  <div className="gradient-custom-2 h-100 mb-5">
    <div className="mask d-flex align-items-center h-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-dark table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">SubTask Name</th>
                    <th scope="col">Attachements</th>
                    <th scope="col">Remark</th>
                    <th scope="col">comments</th>
                  </tr>
                </thead>
                <tbody>
                {subtask.map((subtask, id) => (
                    <tr key={id}>
                    <td>{subtask.subtaskname}</td>
                    <td style={{ fontSize: '20px', display: 'flex', justifyContent: 'space-between' }}><div>
                {subtask.subtaskid}
                <FileFetcher subtaskid={subtask.subtaskid} />
              </div>
              <div>
              </div>
                    
                    </td>
                    <td>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</td>
                    <td><div style={{width: "20px", marginRight:"auto", marginLeft:"auto"}}><FaCommentDots /></div></td>
                    </tr>
                  ))}
                  
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<ul>
  sub
  {subtask.map((subtask) => (
    <li key={subtask.subtaskid}>{subtask.subtaskname}</li>
  ))}
</ul>


{/* Files Section */}
              <div className="mt-4">
                <h5>Attached Files:</h5>
                {files && files.length > 0 ? (
                  <ul className="">
                    {files.map((file) => (
                      <li key={file.id} className="list-group-item d-flex ml-3"
                      style={{alignItems: "center"}}
                      >
                        {file.filename}
                        <button
                          style={{width: "30px", color: "white", fontSize: "20px"}}
                          className="btn  btn-sm"
                          onClick={() => handleFileDownload(file.id, file.filename)}> 
                            <IoMdDownload />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No files uploaded for this task.</p>
                )}
                <button
                    className="btn btn-light mt-4 mb-4"
                    onClick={() => fileInputDom.current.click()}
                  >
                    Upload File
                  </button>
              </div>
              
              

                <div className='d-flex mt 4' style={{height: "30px", justifyContent:"space-between"}}>
              {userRole === 'Admin' || userRole === 'Team Leader' ? (
                <>
                  <button className="btn btn-warning" style={{height: "30px", width: "32%"}} onClick={() => setEditMode(true)}>Edit Task</button>
                  <button className="btn btn-danger" style={{height: "30px",width: "32%"}} onClick={deleteTask}>Delete Task</button>
                  <input
                    ref={fileInputDom}
                    type="file"
                    onChange={handleSaveUploads}
                    multiple
                    className="d-none"
                  />
                </>
              ) : null}
              <Link to={`/${projectId}/tasks`} style={{width: "32%"}}>
                <button className="btn" style={{height: "30px", width: "100%", alignItems:"center", backgroundColor:"gray"}}>Back</button>
              </Link>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="taskname">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="taskname"
                  value={formData.taskname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="userid">Owner</label>
                <select
                  name="userid"
                  className="form-control"
                  value={formData.userid}
                  onChange={handleInputChange}
                >
                  {owners.map((owner) => (
                    <option key={owner.userid} value={owner.userid}>
                      {owner.firstname} {owner.lastname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="starting_date">Starting Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="starting_date"
                  value={formData.starting_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group mt-2" >
                <label htmlFor="note">Note</label>
                <textarea
                  name="note"
                  className="form-control"
                  rows="3"
                  value={formData.note}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button className="btn btn-success mt-2" onClick={handleSaveChanges}>Save Changes</button>
              <button className="btn btn-secondary ml-2 mt-2" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default SingleTask;