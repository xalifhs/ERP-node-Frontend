import React, { useState } from 'react';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState('');

  const fetchCompanies = () => {
    fetch('http://localhost:8080/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err));
  };

  const addCompany = () => {
    fetch('http://localhost:8080/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(newCompany => {
        setCompanies([...companies, newCompany]);
        setName('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Companies</h2>

      <button onClick={fetchCompanies}>Get Companies</button>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addCompany}>Add Company</button>
      </div>

      <table border="1" style={{ marginTop: '1rem' }}>
        <thead>
          <tr><th>ID</th><th>Name</th></tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}><td>{c.id}</td><td>{c.name}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Companies;
