import React, { useState } from 'react';
import './Users.css';
import UsersModal from './UsersModal';

function Users() {
  const [token] = useState(localStorage.getItem('token'));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactInfo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = () => {
    if (!token) return alert("Missing token.");

    const newUser = {
      ...formData,
      type: "employee", // fixed type from backend logic
    };

    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newUser)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to create user");
        setFormData({ name: '', email: '', password: '', contactInfo: '' });
        setShowCreateModal(false);
      })
      .catch(() => alert("Error creating user"));
  };

  return (
    <div className="container">
      <h2>Manage Users</h2>
      <div className="buttons">
        <button onClick={() => setShowCreateModal(true)}>Create New User</button>
        <button onClick={() => setShowUserListModal(true)}>See Registered Users</button>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
            <h3>Create User</h3>
            <div className="form-group">
              <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleInputChange} />
              <input name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleInputChange} />
              <button onClick={handleCreateUser}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* See Users Modal */}
      {showUserListModal && (
        <UsersModal token={token} onClose={() => setShowUserListModal(false)} />
      )}
    </div>
  );
}

export default Users;
