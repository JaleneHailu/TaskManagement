import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './singleTask.css';
import { Link } from 'react-router-dom';
import axios from "../../axios/axios";
import { IoSend } from "react-icons/io5";
import {jwtDecode as jwt_decode} from 'jwt-decode';
import { FaFilePdf, FaCommentDots, FaCloudUploadAlt  } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const FileFetcher = ({ subtaskid }) => {

  const [files, setFiles] = useState([]);
  const handleFileDownload = async (fileId, filename) => {
    if (!fileId || !filename) {
      console.log(fileId);
      console.log(filename);
      console.error('Invalid fileId or filename');
      return;
    }
  
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
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download error:', err.message);
    }
  };
  

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
  
        const response = await axios.get(`/sub${subtaskid}/files`, { headers });
        console.log('Files fetched:', response.data.files); // Full logging
        setFiles(response.data.files);
      } catch (err) {
        console.error("Error fetching files:", err.message);
      }
    };
  
    if (subtaskid) {
      fetchFiles();
    }
  }, [subtaskid]);
  

  return (
    <div className="d-flex">
      {files.length > 0 ? (
        files.map((file, index) => (
          <div
            style={{ color: 'white', position: 'relative', marginRight: '10px', cursor: 'pointer' }}
            key={index}
            title={file.filename} // Shows the filename on hover
            onClick={() => handleFileDownload(file.id, file.filename)} // Trigger download on click
          >
            <FaFilePdf />
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
  
  
};

const CommentComponent = ({ subtaskid }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [writers, setWriter] = useState([]);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }
  
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
      const response = await axios.get(`/sub${subtaskid}/comments`, {headers});
      console.log('Fetched comments:', response.data); // Log the fetched comments
      setComments(response.data);
    }
    catch (err) {
      console.error('Error fetching comments:', err.response ? err.response.data : err.message);
      setError('Error fetching comments.');
    }
  };

  // const handleCommentSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!newComment) {
  //     setError('Comment cannot be empty.');
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem('token');
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     };
  //     // Include subtaskid in the request body
  //     const response = await axios.post(
  //       `/sub${subtaskid}/comment`,
  //       { subtaskid, content: newComment },
  //       { headers }
  //     );
  //     setComments((prevComments) => [response.data, ...prevComments]);
  //     setNewComment('');
  //     setError('');
  //   } catch (err) {
  //     console.error('Error creating comment:', err.response ? err.response.data : err.message);
  //     setError('Error creating comment.');
  //   }
  // };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) {
      setError('Comment cannot be empty.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const firstName = localStorage.getItem('firstname'); // Get first name from local storage
      const lastName = localStorage.getItem('lastname');   // Get last name from local storage
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await axios.post(
        `/sub${subtaskid}/comment`,
        { subtaskid, content: newComment },
        { headers }
      );
      
      // Immediately add the new comment with the correct writer's name to the state
      const newCommentObj = {
        id: response.data.id, // Assuming you get the new comment ID from the response
        content: newComment,
        written_at: new Date().toISOString(), // Set the current date/time
        writer: `${firstName} ${lastName}`, // Use the current user's name from localStorage
      };
  
      setComments((prevComments) => [newCommentObj, ...prevComments]); // Prepend the new comment to the list
      setNewComment(''); // Clear the input field
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error creating comment:', err.response ? err.response.data : err.message);
      setError('Error creating comment.');
    }
  };
  

  const getWriterName = (writerId) => {
    const writer = writers.find((writer) => writer.userid === writerId);
  
    if (writer) {
      // Assuming 'firstname' and 'lastname' are added in the writer data structure
      return `${writer.firstname} ${writer.lastname}`;
    } else {
      console.warn(`writer with ID ${writerId} not found.`);
      return "Unknown writer";
    }
  };
  
  
  

  useEffect(() => {
    if (subtaskid) {
      console.log('Fetching comments for subtask ID:', subtaskid);
      fetchComments();
    }
  }, [subtaskid]);

  return (
    <div>
      {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
      <form onSubmit={handleCommentSubmit}>
        <div className='col-md-12 d-flex' style={{color: "black", backgroundColor: "white", height: "25px", justifyContent: "end"}} >
        <textarea
          // className='col-md-11'
          style={{border: "none", width: "90%", padding:"5px"}}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="1"
          required
        >
        </textarea>
        <button type="submit" style={{width: "10%"}}><IoSend /></button>
        </div>
      </form>
      <div style={{ marginTop: '20px' }}>
        {comments? (
          comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc'}}>
              <p style={{fontSize: "15px"}}>{`${comment.writer}`}</p>
              <div className='d-flex' style={{justifyContent:"space-between"}}>
              <p>{comment.content}</p>
              <small>{new Date(comment.written_at).toLocaleString()}</small>
              </div>
            </div>
          ))
        ) : (
          <div>No comments yet.</div>
        )}
      </div>
    </div>
  );
};



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
  const fileInputRef = useRef(null)
  const [visibleSubtaskId, setVisibleSubtaskId] = useState(null);

  

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

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
          
  //        throw new Error('No authentication token found.');
  //       }


  //       const headers = {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       };

  //       const response = await axios.get(`/sub${subtaskid}/files`, { headers });
  //       setFiles(response.data.files);
  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //   };

  //   fetchFiles();
  // }, [subtaskid]);

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

   // Function to handle file selection and upload
  const onIconClick = (subtaskid) => {
    // Trigger file input click when icon is clicked
    fileInputRef.current.click();
    // When the file is selected, handle file upload
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file, subtaskid);  // Call the file upload function with the file and subtaskid
      }
    };
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

  // Use useEffect to fetch subtasks when component mounts or when taskId/projectId changes
  useEffect(() => {
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

      // Send a POST request to create a subtask
      const response = await axios.post(
        `/projects/${projectId}/task/${taskId}/subtasks`,
        subtaskFormData,
        { headers }
      );
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

  const toggleComments = (subtaskid) => {
    if (visibleSubtaskId === subtaskid) {
      setVisibleSubtaskId(null); // Hide if already open
    } else {
      setVisibleSubtaskId(subtaskid); // Show comments for the clicked subtask
    }
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
          <th>Subtask Name</th>
          <th>Files</th>
          <th>Actions</th>
        </tr>
      </thead>
      {subtask.map((subtask, id) => (
        <tbody key={id} className='mb-4 mt-3'>
          <tr>
            <td>{subtask.subtaskname}</td>
            <td style={{ fontSize: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <FileFetcher subtaskid={subtask.subtaskid} />
              </div>
              <td>
                {/* Upload icon */}
                <FaCloudUploadAlt onClick={() => onIconClick(subtask.subtaskid)} style={{ cursor: 'pointer' }} />
                {/* Hidden file input element */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </td>
            </td>
            <td>
              {/* Button to toggle comment visibility */}
              <button 
                style={{backgroundColor:"transparent", fontSize:"25px", color:"white"}}
                onClick={() => toggleComments(subtask.subtaskid)}
              >
                {visibleSubtaskId === subtask.subtaskid ? <IoMdArrowDropup /> : <IoMdArrowDropdown />                }
              </button>
            </td>
          </tr>

          {/* Conditionally render CommentComponent based on toggle */}
          {visibleSubtaskId === subtask.subtaskid && (
            <tr>
              <td colSpan="3">
                <CommentComponent subtaskid={subtask.subtaskid} />
              </td>
            </tr>
          )}
        </tbody>
      ))}
    </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

            <div className='d-flex mt 4 col-md-6' style={{height: "30px", justifyContent:"space-between"}}>
              {userRole === 'Admin' || userRole === 'Team Leader' ? (
                <>
                  <button className="btn btn-warning" style={{height: "30px", width: "32%"}} onClick={() => setEditMode(true)}>Edit Task</button>
                  <button className="btn btn-danger" style={{height: "30px",width: "32%"}} onClick={deleteTask}>Delete Task</button>
                </>
              ) : null}
              <Link to={`/${projectId}/tasks`} style={{width: "32%"}}>
                <button className="btn" style={{height: "30px", width: "100%", alignItems:"center", backgroundColor:"gray"}}>Back</button>
              </Link>
              </div>
            </>
          ) : (
            <div className='col-md-4 align-items-center' style={{marginRight: "auto", marginLeft: "auto"}}>
              <div className="form-group">
                <label htmlFor="taskname">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  style={{width:"100%"}}
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

              <button className="btn btn-success mt-2 col-md-5" onClick={handleSaveChanges}>Save Changes</button>
              <button className="btn btn-secondary ms-2 mt-2 col-md-5" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default SingleTask;