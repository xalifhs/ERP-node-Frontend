// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Companies from './components/Companies';
import Orders from './components/Orders';
import Users from './components/Users';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Product from './components/Product';
import './App.css';

function AppRoutes({ loggedInUser, setLoggedInUser }) {
  if (!loggedInUser) {
    return (
      <main className="auth-container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={setLoggedInUser} />} />
          <Route path="*" element={<Login onLogin={setLoggedInUser} />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>ERP</h2>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/companies">Companies</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/products">Products</NavLink>
        </nav>
        <button className="logout-btn"
          onClick={() => { localStorage.clear(); setLoggedInUser(null); }}>
          Logout
        </button>
      </aside>
      <div className="main-content">
        <header>
          <h1>Welcome, {loggedInUser.name}</h1>
        </header>
        <section className="page-container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies user={loggedInUser} />} />
            <Route path="/orders" element={<Orders user={loggedInUser} />} />
            <Route path="/users" element={<Users user={loggedInUser} />} />
            <Route path="/products" element={<Product user={loggedInUser} />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <AppRoutes loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
    </Router>
  );
}
