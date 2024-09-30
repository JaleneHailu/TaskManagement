// src/components/FileManager.js
import React, { useState } from 'react';

const FileManager = () => {
    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState(''); // File ID for download
    const [uploadMessage, setUploadMessage] = useState('');
    
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUploadSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Please choose a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        // Add other necessary fields
        formData.append('task_id', 1); // Example value
        formData.append('uploaded_by', 1); // Example value
        formData.append('uploaded_to', 1); // Example value

        try {
            const response = await fetch('http://localhost:3000/api/files/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const result = await response.json();
            setUploadMessage(result.msg || 'File uploaded successfully');
        } catch (error) {
            console.error('Error:', error);
            setUploadMessage('File upload failed');
        }
    };

    // const handleDownload = async () => {
    //     if (!fileId) {
    //         alert('Please enter a valid file ID.');
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`/files/download/${fileId}`, {
    //             method: 'GET'
    //         });

    //         if (!response.ok) {
    //             throw new Error('File download failed');
    //         }

    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = `file_${fileId}`; // Customize filename as needed
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('File download failed');
    //     }
    // };

    return (
        <div>
            <h1>File Manager</h1>
            
            {/* File Upload Form */}
            <div>
                <h2>Upload File</h2>
                <form onSubmit={handleUploadSubmit}>
                    <input type="file" onChange={handleFileChange} required />
                    <button type="submit">Upload File</button>
                </form>
                <p>{uploadMessage}</p>
            </div>

            {/* File Download Section */}
            {/* <div>
                <h2>Download File</h2>
                <input 
                    type="text" 
                    placeholder="Enter file ID" 
                    value={fileId} 
                    onChange={(e) => setFileId(e.target.value)} 
                />
                <button onClick={handleDownload}>Download File</button>
            </div> */}
        </div>
    );
};

export default FileManager;
