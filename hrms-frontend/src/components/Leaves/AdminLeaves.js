import React, { useState, useEffect } from 'react';
import axios from '../../api';
import './AdminLeaves.css';

const AdminLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllLeaves = async () => {
            try {
                const response = await axios.get('/all-leaves/');
                setLeaves(response.data.results);
            } catch (error) {
                console.error('Error fetching leaves:', error);
                setError('Failed to load leaves. Please try again later.');
            }
        };

        fetchAllLeaves();
    }, []);

    const handleApproveLeave = async (leaveId) => {
        try {
            await axios.put('/update-leaves/', { id: leaveId, status: 'Approved' });
            const response = await axios.get('/all-leaves/');
            setLeaves(response.data.results);
        } catch (error) {
            console.error('Failed to approve leave:', error);
            setError('Failed to approve leave. Please try again later.');
        }
    };

    return (
        <div className="admin-leaves-container">
            <h3>All Leaves</h3>
            {error && <p className="error-message">{error}</p>}
            {leaves.length > 0 ? (
                leaves.map(leave => (
                    <div key={leave.id} className="leave-card">
                        <p><strong>Date:</strong> {new Date(leave.date).toLocaleDateString()}</p>
                        <p><strong>Type:</strong> {leave.type}</p>
                        <p><strong>Status:</strong> {leave.status}</p>
                        <p><strong>Reason:</strong> {leave.reason || 'N/A'}</p>
                        <p><strong>Leave Day Type:</strong> {leave.leave_day_type}</p>
                        {leave.status !== 'Approved' && (
                            <button 
                                className="approve-button" 
                                onClick={() => handleApproveLeave(leave.id)}
                            >
                                Approve
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No leaves available.</p>
            )}
        </div>
    );
};

export default AdminLeaves;
