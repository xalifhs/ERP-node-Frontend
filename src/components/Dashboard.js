import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!token) {
      navigate('/');
      return;
    }

    setUserType(type);
    setName(userName);
    setEmail(userEmail);

    fetch("http://localhost:3001/api/test", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Protected data:", data);
      })
      .catch(err => console.error(err));

  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-info">
        <p><strong>Type:</strong> {userType}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>
    </div>
  );
}

export default Dashboard;
