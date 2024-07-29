import React, { useState } from 'react';
import './TaskTable.css';

const TaskTable = () => {
    const tableItems = [
        { taskname: 'BackEnd Deployment', ownername: 'Abebe Feleke' },
        { taskname: 'Database Table', ownername: 'Abebech Feleke' },
        { taskname: 'BackEnd Deployment', ownername: 'Abebe Feleke' },
        { taskname: 'Database Table', ownername: 'Abebech Feleke' }
    ];

    const [priorityColors, setPriorityColors] = useState({});
    const [statusColors, setStatusColors] = useState({});

    const updateColor = (e, index, setColor) => {
        const value = e.target.value;
        let color;

        switch (value) {
            case 'high':
                color = '#F55E00';
                break;
            case 'medium':
                color = '#FF9A5C';
                break;
            case 'low':
                color = '#FFCDAD';
                break;
            case 'delivered':
                color = '#6fa126';
                break;
            case 'onProgress':
                color = '#ffde59';
                break;
            case 'stuck':
                color = '#df5453';
                break;
            default:
                color = '#000'; 
        }

        setColor((prevColors) => ({
            ...prevColors,
            [index]: color,
        }));
    };

    return (
        <div>
            <div className="table">
                <div className="name_and_task">
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Front-End Project</div>
                    <div style={{ fontWeight: 'lighter', fontSize: '13px' }}>Samson Abebe</div>
                </div>
                <div className="priority custom-select">
                    <select
                        id="prioritySelectFrontEnd"
                        onChange={(e) => updateColor(e, 'frontEnd', setPriorityColors)}
                        style={{ color: priorityColors['frontEnd'] }}
                    >
                        <option style={{ color: '#F55E00' }} value="high">High</option>
                        <option style={{ color: '#FF9A5C' }} value="medium">Medium</option>
                        <option style={{ color: '#FFCDAD' }} value="low">Low</option>
                    </select>
                </div>
                <div className="status custom-select">
                    <select
                        id="statusSelectFrontEnd"
                        onChange={(e) => updateColor(e, 'frontEnd', setStatusColors)}
                        style={{ color: statusColors['frontEnd'] }}
                    >
                        <option style={{ color: '#6fa126' }} value="delivered">Delivered</option>
                        <option style={{ color: '#ffde59' }} value="onProgress">On Progress</option>
                        <option style={{ color: '#df5453' }} value="stuck">Stuck</option>
                    </select>
                </div>
            </div>
            <hr style={{ backgroundColor: '#2b2b2b' }} />

            {tableItems.map((item, index) => (
                <div key={index}>
                    <div className="table">
                        <div className="name_and_task">
                            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.taskname}</div>
                            <div style={{ fontWeight: 'lighter', fontSize: '13px' }}>{item.ownername}</div>
                        </div>
                        <div className="priority custom-select">
                            <select
                                id={`prioritySelect${index}`}
                                onChange={(e) => updateColor(e, index, setPriorityColors)}
                                style={{ color: priorityColors[index] }}
                            >
                                <option style={{ color: '#F55E00' }} value="high">High</option>
                                <option style={{ color: '#FF9A5C' }} value="medium">Medium</option>
                                <option style={{ color: '#FFCDAD' }} value="low">Low</option>
                            </select>
                        </div>
                        <div className="status custom-select">
                            <select
                                id={`statusSelect${index}`}
                                onChange={(e) => updateColor(e, index, setStatusColors)}
                                style={{ color: statusColors[index] }}
                            >
                                <option style={{ color: '#6fa126' }} value="delivered">Delivered</option>
                                <option style={{ color: '#ffde59' }} value="onProgress">On Progress</option>
                                <option style={{ color: '#df5453' }} value="stuck">Stuck</option>
                            </select>
                        </div>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default TaskTable;
