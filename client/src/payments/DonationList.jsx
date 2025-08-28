import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const DonationList = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/payments/donations`)
      .then(res => res.json())
      .then(data => setDonations(data.donations || []));
  }, []);

  return (
    <div>
      <h3>История донатов</h3>
      <ul className="donation-list">
        {donations.map((d, idx) => (
          <li key={idx}>
            {d.date}: {d.amount} ₽ — {d.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationList;
