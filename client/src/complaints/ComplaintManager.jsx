import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';

const ComplaintManager = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/complaints`)
      .then(res => res.json())
      .then(data => setComplaints(data.complaints || []));
  }, []);

  const handleSubmit = async (complaint) => {
    await apiFetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint)
    });
    // Refresh list
    const res = await apiFetch(`${API_BASE_URL}/complaints`);
    const data = await res.json();
    setComplaints(data.complaints || []);
  };

  return (
    <div>
      <h2>Жалобы и модерация</h2>
      <ComplaintForm onSubmit={handleSubmit} />
      <ComplaintList complaints={complaints} />
    </div>
  );
};

export default ComplaintManager;
