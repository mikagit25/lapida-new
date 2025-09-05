import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const CompanyAdminPanel = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/companies`)
      .then(res => res.json())
      .then(data => setCompanies(data.companies || []));
  }, []);

  return (
    <div>
      <h3>Компании</h3>
      <ul>
        {companies.map((c, idx) => (
          <li key={idx}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyAdminPanel;
