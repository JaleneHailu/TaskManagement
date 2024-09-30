import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../axios/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from URL

  // Use refs and state to store form inputs
  const tasknameDom = useRef();
  const ownernameDom = useRef();
  const startingDateDom = useRef();
  const dueDateDom = useRef();
  const priorityDom = useRef();
  const noteDom = useRef();
  const fileInputDom = useRef(); // New ref for file upload
  const fileDescriptionDom = useRef();

  const [owners, setOwners] = useState([]);
  const [taskId, setTaskId] = useState(null); // Store the task ID after creation

  useEffect(() => {
    async function fetchOwners() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const response = await axios.get('/users/all', {headers});
        setOwners(response.data);
      } catch (error) {
        console.error('Error fetching owners:', error.response || error.message);
      } 
    }
    fetchOwners();
  }, []);

  // Handle task creation
  async function handleSubmit(e) {
    e.preventDefault();

    let tasknameValue = tasknameDom.current.value.trim();
    let ownernameValue = ownernameDom.current.value;
    let startingDateValue = startingDateDom.current.value;
    let dueDateValue = dueDateDom.current.value;
    let priorityValue = priorityDom.current.value;
    let noteValue = noteDom.current.value.trim();

    if (!tasknameValue || !ownernameValue || !startingDateValue || !dueDateValue) {
      alert('Please provide task name, owner, starting date, and due date.');
      return;
    }

    if (new Date(startingDateValue) > new Date(dueDateValue)) {
      alert('Due date cannot be before the starting date.');
      return;
    }

    const taskData = {
      taskname: tasknameValue,
      userid: ownernameValue,
      starting_date: startingDateValue,
      due_date: dueDateValue,
      priority: priorityValue,
      note: noteValue,
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`/projects/${projectId}/createTask`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const createdTaskId = response.data.taskId;
      setTaskId(createdTaskId); // Save taskId for further file uploads

      if (fileInputDom.current.files.length > 0) {
        await handleMultipleFileUpload(createdTaskId); // Upload all selected files
      }

      alert('Task and files uploaded successfully.');
      navigate(`/${projectId}/tasks`); // Redirect after upload
    } catch (error) {
      console.error('Error during task creation:', error.response ? error.response.data : error.message);
      alert(error?.response?.data?.message || 'An error occurred');
    }
  }

  // Handle multiple file uploads after task is created
  const handleMultipleFileUpload = async (taskId) => {
    const files = fileInputDom.current.files;
    const token = localStorage.getItem('token');

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      const file = files[i];

      formData.append('file', file);
      formData.append('filedescription', fileDescriptionDom.current.value); // Common file description
      // formData.append('uploaded_to', uploadedToDom.current.value); // Common upload location

      try {
        await axios.post(`/upload/${taskId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        alert(error?.response?.data?.message || 'An error occurred while uploading files.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="formWrapper">
            <h2 className="mb-4 text-center">Avi Trust Homes</h2>
            <h4 className="mb-4 text-center">Create Task</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 cont">
                <label htmlFor="taskName" className="form-label">Task Name</label>
                <input ref={tasknameDom} type="text" placeholder="Task name" className="form-control" />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="owner" className="form-label">Task Owner</label>
                <select ref={ownernameDom} className="form-control">
                  <option value="">Select Owner</option>
                  {owners.map(owner => (
                    <option key={owner.userid} value={owner.userid}>
                      {owner.firstname} {owner.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 cont">
                <label htmlFor="startingDate" className="form-label">Starting Date</label>
                <input ref={startingDateDom} type="date" className="form-control" />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input ref={dueDateDom} type="date" className="form-control" />
              </div>
              <div className="mb-3 cont">
                <label htmlFor="priority" className="form-label">Priority</label>
                <select ref={priorityDom} className="form-control">
                  <option value="" className="default-option">Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="mb-3 cont">
                <label htmlFor="note" className="form-label">Note</label>
                <textarea ref={noteDom} type="text" placeholder="Note" className="form-control ms-5" />
              </div>

              {/* File Upload Section */}
              <div className="mb-3 cont">
                <label htmlFor="file" className="form-label">Files</label>
                <input ref={fileInputDom} type="file" className="form-control" multiple /> {/* Enable multiple file selection */}
              </div>
              <div className="mb-3 cont">
                <label htmlFor="fileDescription" className="form-label">File Description</label>
                <input ref={fileDescriptionDom} type="text" className="form-control" placeholder="Optional" />
              </div>
              <div className="d-flex justify-content-between">
                <Link to={`/${projectId}/tasks`}  className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
