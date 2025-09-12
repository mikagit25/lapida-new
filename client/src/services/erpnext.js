import { API_BASE_URL } from '../config/api';

export async function saveErpnextToken(companyId, token) {
  const res = await fetch(`${API_BASE_URL}/companies/${companyId}/erpnext-token`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ token })
  });
  return res.json();
}

export async function testErpnextConnection(companyId) {
  const res = await fetch(`${API_BASE_URL}/companies/${companyId}/erpnext-test`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
    }
  });
  return res.json();
}
