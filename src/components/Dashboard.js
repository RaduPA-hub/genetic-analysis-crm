import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('exomes');
  
  // Mock data for exomes management
  const [exomes, setExomes] = useState([
    {
      id: 1,
      name: "Whole Exome Sequencing",
      description: "Comprehensive analysis of protein-coding regions of the genome",
      category: "Genetic Testing",
      duration: "2-3 weeks",
      status: "Active"
    },
    {
      id: 2,
      name: "Targeted Exome Panel",
      description: "Focused analysis of specific disease-related genes",
      category: "Genetic Testing",
      duration: "1-2 weeks",
      status: "Active"
    }
  ]);

  // Mock data for pending user registrations
  const [pendingUsers] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@hospital.com",
      specialty: "Cardiology",
      hospital: "City General Hospital",
      requestDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@clinic.com",
      specialty: "Neurology",
      hospital: "Regional Medical Center",
      requestDate: "2024-01-14"
    }
  ]);

  // Mock data for pending exome requests
  const [pendingRequests] = useState([
    {
      id: 1,
      userName: "Dr. Michael Brown",
      userEmail: "michael.brown@hospital.com",
      exomeName: "Whole Exome Sequencing",
      requestDate: "2024-01-15",
      reason: "Research study on genetic disorders"
    },
    {
      id: 2,
      userName: "Dr. Emily Davis",
      userEmail: "emily.davis@clinic.com",
      exomeName: "Cardiovascular Exome",
      requestDate: "2024-01-14",
      reason: "Patient diagnosis and treatment planning"
    }
  ]);

  const [editingExome, setEditingExome] = useState(null);
  const [newExome, setNewExome] = useState({
    name: '',
    description: '',
    category: '',
    duration: ''
  });

  const handleAddExome = () => {
    if (newExome.name && newExome.description && newExome.category && newExome.duration) {
      const exome = {
        id: Date.now(),
        ...newExome,
        status: "Active"
      };
      setExomes([...exomes, exome]);
      setNewExome({ name: '', description: '', category: '', duration: '' });
    }
  };

  const handleEditExome = (exome) => {
    setEditingExome(exome);
    setNewExome({ ...exome });
  };

  const handleUpdateExome = () => {
    if (editingExome && newExome.name && newExome.description && newExome.category && newExome.duration) {
      setExomes(exomes.map(e => e.id === editingExome.id ? { ...newExome, id: e.id, status: e.status } : e));
      setEditingExome(null);
      setNewExome({ name: '', description: '', category: '', duration: '' });
    }
  };

  const handleDeleteExome = (exomeId) => {
    if (window.confirm('Are you sure you want to delete this exome?')) {
      setExomes(exomes.filter(e => e.id !== exomeId));
    }
  };

  const handleApproveUser = (userId) => {
    // This will be implemented later with actual approval logic
    console.log(`User ${userId} approved`);
    alert(`User ${pendingUsers.find(u => u.id === userId)?.name} has been approved!`);
  };

  const handleApproveRequest = (requestId) => {
    // This will be implemented later with actual approval logic
    console.log(`Request ${requestId} approved`);
    alert(`Request ${requestId} has been approved!`);
  };

  const handleRejectRequest = (requestId) => {
    // This will be implemented later with actual rejection logic
    console.log(`Request ${requestId} rejected`);
    alert(`Request ${requestId} has been rejected!`);
  };

  return (
    <main className="dashboard-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage exomes, user registrations, and service requests</p>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'exomes' ? 'active' : ''}`}
            onClick={() => setActiveTab('exomes')}
          >
            <i className="fas fa-dna"></i>
            Manage Exomes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i>
            Pending Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <i className="fas fa-clipboard-list"></i>
            Pending Requests
          </button>
        </div>
        
        <div className="dashboard-content-area">
          {/* Exomes Management Tab */}
          {activeTab === 'exomes' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Manage Exomes</h2>
                <button className="add-exome-btn" onClick={() => setEditingExome({})}>
                  <i className="fas fa-plus"></i>
                  Add New Exome
                </button>
              </div>
              
              {/* Add/Edit Exome Form */}
              {(editingExome || Object.keys(newExome).some(key => newExome[key])) && (
                <div className="exome-form">
                  <h3>{editingExome ? 'Edit Exome' : 'Add New Exome'}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={newExome.name}
                        onChange={(e) => setNewExome({...newExome, name: e.target.value})}
                        placeholder="Exome name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        value={newExome.category}
                        onChange={(e) => setNewExome({...newExome, category: e.target.value})}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newExome.description}
                      onChange={(e) => setNewExome({...newExome, description: e.target.value})}
                      placeholder="Exome description"
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={newExome.duration}
                      onChange={(e) => setNewExome({...newExome, duration: e.target.value})}
                      placeholder="e.g., 2-3 weeks"
                    />
                  </div>
                  <div className="form-actions">
                    {editingExome ? (
                      <>
                        <button className="btn-secondary" onClick={() => {setEditingExome(null); setNewExome({name: '', description: '', category: '', duration: ''});}}>
                          Cancel
                        </button>
                        <button className="btn-primary" onClick={handleUpdateExome}>
                          Update Exome
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-secondary" onClick={() => setNewExome({name: '', description: '', category: '', duration: ''})}>
                          Cancel
                        </button>
                        <button className="btn-primary" onClick={handleAddExome}>
                          Add Exome
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Exomes List */}
              <div className="exomes-list">
                {exomes.map((exome) => (
                  <div key={exome.id} className="exome-item">
                    <div className="exome-info">
                      <h4>{exome.name}</h4>
                      <p className="exome-category">{exome.category}</p>
                      <p className="exome-description">{exome.description}</p>
                      <div className="exome-details">
                        <span>Duration: {exome.duration}</span>
                        <span className={`status ${exome.status.toLowerCase()}`}>{exome.status}</span>
                      </div>
                    </div>
                    <div className="exome-actions">
                      <button className="btn-secondary" onClick={() => handleEditExome(exome)}>
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
                      <button className="btn-danger" onClick={() => handleDeleteExome(exome.id)}>
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Pending Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <h2>Pending User Registrations</h2>
              <div className="users-list">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p className="user-email">{user.email}</p>
                      <p className="user-specialty">Specialty: {user.specialty}</p>
                      <p className="user-hospital">Hospital: {user.hospital}</p>
                      <p className="user-date">Request Date: {user.requestDate}</p>
                    </div>
                    <div className="user-actions">
                      <button className="btn-primary" onClick={() => handleApproveUser(user.id)}>
                        <i className="fas fa-check"></i>
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Pending Requests Tab */}
          {activeTab === 'requests' && (
            <div className="tab-content">
              <h2>Pending Exome Requests</h2>
              <div className="requests-list">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-info">
                      <h4>{request.exomeName}</h4>
                      <p className="request-user">Requested by: {request.userName}</p>
                      <p className="request-email">{request.userEmail}</p>
                      <p className="request-reason">Reason: {request.reason}</p>
                      <p className="request-date">Request Date: {request.requestDate}</p>
                    </div>
                    <div className="request-actions">
                      <button className="btn-primary" onClick={() => handleApproveRequest(request.id)}>
                        <i className="fas fa-check"></i>
                        Approve
                      </button>
                      <button className="btn-danger" onClick={() => handleRejectRequest(request.id)}>
                        <i className="fas fa-times"></i>
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard; 