import React, { useEffect, useState } from 'react';
import './UsersModal.css';

function UsersModal({ token, onClose }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Error fetching users", err));
  }, [token]);

  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={e => e.stopPropagation()}>
        <button className="um-close" onClick={onClose} aria-label="Close">&times;</button>
        <h3>Registered Users</h3>
        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0
                ? <tr><td colSpan="5">No users found</td></tr>
                : users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.contactInfo || '-'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersModal;
