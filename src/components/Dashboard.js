import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import './Dashboard.css';

// Validation schema for exome creation
const exomeValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Exome name is required')
    .min(3, 'Exome name must be at least 3 characters')
    .max(100, 'Exome name must be no more than 100 characters'),
  
  tag: Yup.string()
    .max(50, 'Tag must be no more than 50 characters'),
  
  description: Yup.string()
    .max(500, 'Description must be no more than 500 characters'),
  
  slot: Yup.number()
    .required('Number of slots is required')
    .min(1, 'Must have at least 1 slot')
    .max(1000, 'Cannot have more than 1000 slots')
    .integer('Slots must be a whole number'),
  
  runs: Yup.number()
    .required('Number of runs is required')
    .min(0, 'Runs cannot be negative')
    .max(1000, 'Cannot have more than 1000 runs')
    .integer('Runs must be a whole number'),
  
  batch: Yup.string()
    .max(50, 'Batch must be no more than 50 characters'),
  
  expire_at: Yup.date()
    .min(new Date(), 'Expiration date must be in the future'),
  
  status: Yup.string()
    .oneOf(['Active', 'Running', 'Suspended'], 'Please select a valid status')
});

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('exomes');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Exomes management state
  const [exomes, setExomes] = useState([]);

  // Real data for pending exome requests
  const [pendingRequests, setPendingRequests] = useState([]);

  // Patients view state
  const [viewingPatients, setViewingPatients] = useState(null);
  const [exomePatients, setExomePatients] = useState([]);

  const [editingExome, setEditingExome] = useState(null);
  const [newExome, setNewExome] = useState({
    name: '',
    tag: '',
    description: '',
    slot: '',
    runs: '',
    batch: '',
    expire_at: '',
    status: 'Active'
  });
  const [exomeErrors, setExomeErrors] = useState({});

  // Fetch pending users from API
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pending-users');
      const data = await response.json();
      
      if (data.status === 'ok') {
        setPendingUsers(data.users);
      } else {
        console.error('Error fetching pending users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exomes from API (dashboard shows all exomes including zero runs)
  const fetchExomes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exomes/all');
      const data = await response.json();
      if (data.status === 'ok') {
        setExomes(data.exomes);
      }
    } catch (error) {
      console.error('Error fetching exomes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending exome requests from API
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pending-requests');
      const data = await response.json();
      
      if (data.status === 'ok') {
        setPendingRequests(data.requests);
      } else {
        console.error('Error fetching pending requests:', data.message);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients for a specific exome
  const fetchExomePatients = async (exomeId, exomeName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exomes/${exomeId}/patients`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setExomePatients(data.patients);
        setViewingPatients({ id: exomeId, name: exomeName });
      } else {
        console.error('Error fetching exome patients:', data.message);
        alert('Error fetching patients: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching exome patients:', error);
      alert('Error fetching patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create new exome
  const createExome = async (exomeData) => {
    try {
      const response = await fetch('/api/exomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exomeData),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        await fetchExomes(); // Refresh the list
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error creating exome:', error);
      return { success: false, message: 'Error creating exome' };
    }
  };

  // Update exome
  const updateExome = async (id, exomeData) => {
    try {
      const response = await fetch(`/api/exomes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exomeData),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        await fetchExomes(); // Refresh the list
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating exome:', error);
      return { success: false, message: 'Error updating exome' };
    }
  };

  // Delete exome
  const deleteExome = async (id) => {
    try {
      const response = await fetch(`/api/exomes/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'ok') {
        await fetchExomes(); // Refresh the list
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error deleting exome:', error);
      return { success: false, message: 'Error deleting exome' };
    }
  };

  // Load data when component mounts or when tab is selected
  useEffect(() => {
    if (activeTab === 'users') {
      fetchPendingUsers();
    } else if (activeTab === 'exomes') {
      fetchExomes();
    } else if (activeTab === 'requests') {
      fetchPendingRequests();
    }
  }, [activeTab]);

  const handleAddExome = async () => {
    try {
      // Convert string values to numbers for validation
      const exomeData = {
        ...newExome,
        slot: newExome.slot ? parseInt(newExome.slot) : '',
        runs: newExome.runs ? parseInt(newExome.runs) : '',
        expire_at: newExome.expire_at ? new Date(newExome.expire_at) : ''
      };
      
      await exomeValidationSchema.validate(exomeData, { abortEarly: false });
      setExomeErrors({});
      
      const result = await createExome(newExome);
      if (result.success) {
        setNewExome({ 
          name: '', 
          tag: '', 
          description: '', 
          slot: '', 
          runs: '', 
          batch: '', 
          expire_at: '', 
          status: 'Active' 
        });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setExomeErrors(newErrors);
    }
  };

  const handleEditExome = (exome) => {
    setEditingExome(exome);
    setNewExome({
      name: exome.name,
      tag: exome.tag || '',
      description: exome.description || '',
      slot: exome.slot,
      runs: exome.runs,
      batch: exome.batch || '',
      expire_at: exome.expire_at ? exome.expire_at.split('T')[0] : '',
      status: exome.status || 'Active'
    });
  };

  const handleUpdateExome = async () => {
    if (editingExome && newExome.name && newExome.slot && newExome.runs) {
      const result = await updateExome(editingExome.id_exome, newExome);
      if (result.success) {
        setEditingExome(null);
        setNewExome({ 
          name: '', 
          tag: '', 
          description: '', 
          slot: '', 
          runs: '', 
          batch: '', 
          expire_at: '', 
          status: 'Active' 
        });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } else {
      alert('Please fill in all required fields (Name, Slot, Runs)');
    }
  };

  const handleDeleteExome = async (exomeId) => {
    if (window.confirm('Are you sure you want to delete this exome?')) {
      const result = await deleteExome(exomeId);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const response = await fetch('/api/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        // Remove the approved user from the pending list
        setPendingUsers(prevUsers => prevUsers.filter(user => user.id_credentials !== userId));
        alert('User approved successfully!');
      } else {
        alert(`Error approving user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user. Please try again.');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch('/api/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, approvedBy: 1 }) // TODO: Get from auth
      });
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        setPendingRequests(prevRequests => prevRequests
          .map(requestGroup => {
            const patients = requestGroup.patients.filter(patient => patient.id_request !== requestId);
            return {
              ...requestGroup,
              patients
            };
          })
          .filter(requestGroup => requestGroup.patients.length > 0));
        alert('Request approved successfully!');
      } else {
        alert(`Error approving request: ${data.message}`);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    const rejectionReason = prompt('Please provide a reason for rejection (optional):');
    
    try {
      const response = await fetch('/api/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          rejectionReason: rejectionReason || 'No reason provided',
          rejectedBy: 1 // TODO: Get from auth
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        setPendingRequests(prevRequests => prevRequests
          .map(requestGroup => {
            const patients = requestGroup.patients.filter(patient => patient.id_request !== requestId);
            return {
              ...requestGroup,
              patients
            };
          })
          .filter(requestGroup => requestGroup.patients.length > 0));
        alert('Request rejected successfully!');
      } else {
        alert(`Error rejecting request: ${data.message}`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    }
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
                <button className="add-exome-btn" onClick={() => {
                  setEditingExome({});
                  setNewExome({name: '', tag: '', description: '', slot: '', runs: '', batch: '', expire_at: '', status: 'Active'});
                }}>
                  <i className="fas fa-plus"></i>
                  Add New Exome
                </button>
              </div>
              
              {/* Add/Edit Exome Form */}
              {editingExome !== null && (
                <div className="exome-form">
                  <h3>{editingExome.id_exome ? 'Edit Exome' : 'Add New Exome'}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={newExome.name}
                        onChange={(e) => setNewExome({...newExome, name: e.target.value})}
                        placeholder="Exome name"
                        required
                      />
                      {exomeErrors.name && <span className="error-message">{exomeErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label>Tag</label>
                      <input
                        type="text"
                        value={newExome.tag}
                        onChange={(e) => setNewExome({...newExome, tag: e.target.value})}
                        placeholder="e.g., GENETIC TESTING"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Slot *</label>
                      <input
                        type="number"
                        value={newExome.slot}
                        onChange={(e) => setNewExome({...newExome, slot: parseInt(e.target.value) || ''})}
                        placeholder="Total slots available"
                        min="1"
                        required
                      />
                      {exomeErrors.slot && <span className="error-message">{exomeErrors.slot}</span>}
                    </div>
                    <div className="form-group">
                      <label>Runs *</label>
                      <input
                        type="number"
                        value={newExome.runs}
                        onChange={(e) => setNewExome({...newExome, runs: parseInt(e.target.value) || ''})}
                        placeholder="Number of runs"
                        min="0"
                        required
                      />
                      {exomeErrors.runs && <span className="error-message">{exomeErrors.runs}</span>}
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
                  <div className="form-row">
                    <div className="form-group">
                      <label>Batch</label>
                      <input
                        type="text"
                        value={newExome.batch}
                        onChange={(e) => setNewExome({...newExome, batch: e.target.value})}
                        placeholder="e.g., WES-2024-001"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expire Date</label>
                      <input
                        type="date"
                        value={newExome.expire_at}
                        onChange={(e) => setNewExome({...newExome, expire_at: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newExome.status}
                      onChange={(e) => setNewExome({...newExome, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Running">Running</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    {editingExome.id_exome ? (
                      <>
                        <button className="btn-secondary" onClick={() => {setEditingExome(null); setNewExome({name: '', tag: '', description: '', slot: '', runs: '', batch: '', expire_at: '', status: 'Active'});}}>
                          Cancel
                        </button>
                        <button className="btn-primary" onClick={handleUpdateExome}>
                          Update Exome
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-secondary" onClick={() => {setEditingExome(null); setNewExome({name: '', tag: '', description: '', slot: '', runs: '', batch: '', expire_at: '', status: 'Active'});}}>
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
                {loading ? (
                  <div className="loading-message">
                    <i className="fas fa-spinner fa-spin"></i>
                    Loading exomes...
                  </div>
                ) : exomes.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-dna"></i>
                    <h3>No Exomes Found</h3>
                    <p>Create your first exome to get started.</p>
                  </div>
                ) : (
                  exomes.map((exome) => (
                    <div key={exome.id_exome} className={`exome-item ${exome.runs === 0 ? 'zero-runs' : ''}`}>
                      <div className="exome-info">
                        <h4>{exome.name}</h4>
                        {exome.tag && (
                          <div className="exome-tag">
                            <span className="tag-badge">{exome.tag}</span>
                          </div>
                        )}
                        <p className="exome-description">{exome.description}</p>
                        <div className="exome-details">
                          <div className="slot-info">
                            <span className="slot-label">Available Slots:</span>
                            <span className={`slot-count ${exome.available_slots <= 2 ? 'low-slots' : ''}`}>
                              {exome.available_slots} / {exome.slot}
                            </span>
                          </div>
                          <div className="exome-meta">
                            <span className={exome.runs === 0 ? 'zero-runs-text' : ''}>Runs: {exome.runs}</span>
                            {exome.batch && <span>Batch: {exome.batch}</span>}
                            {exome.expire_at && <span>Expires: {new Date(exome.expire_at).toLocaleDateString()}</span>}
                          </div>
                          <div className="status-row">
                            <span className={`status ${exome.status.toLowerCase()}`}>{exome.status}</span>
                            {exome.runs === 0 && (
                              <span className="hidden-badge">HIDDEN FROM MAIN PAGE</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="exome-actions">
                        <button className="btn-secondary" onClick={() => handleEditExome(exome)}>
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        <button className="btn-info" onClick={() => fetchExomePatients(exome.id_exome, exome.name)}>
                          <i className="fas fa-users"></i>
                          View Patients
                        </button>
                        <button className="btn-danger" onClick={() => handleDeleteExome(exome.id_exome)}>
                          <i className="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Patients View Modal */}
          {viewingPatients && (
            <div className="modal-overlay">
              <div className="modal-content patients-modal">
                <div className="modal-header">
                  <h2>Patients in {viewingPatients.name}</h2>
                  <button 
                    className="btn-close" 
                    onClick={() => {
                      setViewingPatients(null);
                      setExomePatients([]);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  {loading ? (
                    <p>Loading patients...</p>
                  ) : exomePatients.length === 0 ? (
                    <p>No patients assigned to this exome yet.</p>
                  ) : (
                    <div className="patients-list">
                      {exomePatients.map((patient) => (
                        <div key={patient.id_pacient} className="patient-item">
                          <div className="patient-info">
                            <h4>Patient {patient.initials}</h4>
                            <div className="patient-details">
                              <p><strong>Age:</strong> {patient.age}</p>
                              <p><strong>Sex:</strong> {patient.sex}</p>
                              <p><strong>Family ID:</strong> {patient.family_identifier}</p>
                              <p><strong>Description:</strong> {patient.description || 'No description'}</p>
                              <p><strong>Added to Exome:</strong> {new Date(patient.started_at).toLocaleDateString()}</p>
                              {patient.end_at && (
                                <p><strong>Completed:</strong> {new Date(patient.end_at).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setViewingPatients(null);
                      setExomePatients([]);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Pending Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Pending User Registrations</h2>
                <button className="btn-secondary" onClick={fetchPendingUsers} disabled={loading}>
                  <i className="fas fa-refresh"></i>
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loading ? (
                <div className="loading-message">
                  <i className="fas fa-spinner fa-spin"></i>
                  Loading pending users...
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-users"></i>
                  <h3>No Pending Users</h3>
                  <p>All users have been approved or no new registrations are waiting.</p>
                </div>
              ) : (
                <div className="users-list">
                  {pendingUsers.map((user) => (
                    <div key={user.id_credentials} className="user-item">
                      <div className="user-info">
                        <h4>{user.f_name} {user.l_name}</h4>
                        <p className="user-email">{user.email}</p>
                        <p className="user-center">Center: {user.center || 'Not specified'}</p>
                        <p className="user-address">Address: {user.address_1 || 'Not specified'}</p>
                        <p className="user-phone">Phone: {user.phone_number || 'Not specified'}</p>
                        <p className="user-role">Role: {user.type_name}</p>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="btn-primary" 
                          onClick={() => handleApproveUser(user.id_credentials)}
                        >
                          <i className="fas fa-check"></i>
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Pending Requests Tab */}
          {activeTab === 'requests' && (
            <div className="tab-content">
              <h2>Pending Exome Requests</h2>
              <div className="requests-list">
                {pendingRequests.length === 0 ? (
                  <p>No pending requests</p>
                ) : (
                  pendingRequests.map((requestGroup) => (
                    <div
                      key={requestGroup.id_request_group
                        ? `group-${requestGroup.id_request_group}`
                        : `request-${requestGroup.patients[0].id_request}`}
                      className="request-item grouped-request-card"
                    >
                      <div className="request-info request-group-header">
                        <h4>{requestGroup.exome_name}</h4>
                        <p className="request-user">
                          Requested by: Dr. {requestGroup.f_name} {requestGroup.l_name}
                        </p>
                        <p className="request-email">{requestGroup.email}</p>
                        <p className="request-center">Center: {requestGroup.center || 'Not specified'}</p>
                        <div className="request-group-meta">
                          <span>{requestGroup.request_type} request</span>
                          <span>
                            {requestGroup.patient_count} {requestGroup.patient_count === 1 ? 'patient' : 'family members'}
                          </span>
                        </div>
                      </div>

                      <div className="request-patient-list">
                        {requestGroup.patients.map((patient) => (
                          <div key={patient.id_request} className="request-patient-row">
                            <div className="request-patient-details">
                              <h5>{patient.initials}</h5>
                              <p>
                                Age: {patient.age ?? 'N/A'} | Sex: {patient.sex || 'N/A'} |
                                Relation: {patient.family_relation ?? 'N/A'}
                              </p>
                              <p>{patient.description || 'No description'}</p>
                              <p className="request-reason">Reason: {patient.reason || 'Not specified'}</p>
                              <p className="request-date">
                                Request Date: {new Date(patient.request_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="request-actions">
                              <button
                                className="btn-primary"
                                onClick={() => handleApproveRequest(patient.id_request)}
                              >
                                <i className="fas fa-check"></i>
                                Approve
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => handleRejectRequest(patient.id_request)}
                              >
                                <i className="fas fa-times"></i>
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
