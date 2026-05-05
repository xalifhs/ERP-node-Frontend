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

  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  const placeOrder = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Not logged in");
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          {
            product: { id: 1 },
            amount: 2,
          },
        ],
      }),
    });

    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Order failed");
    }

    alert("Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert("Error placing order: " + err.message);
    }
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
