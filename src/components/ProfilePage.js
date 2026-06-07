import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ onLogout }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Mock data for user's exome requests
  const [requestedExomes] = useState([
    {
      id: 1,
      name: "Whole Genome Analysis",
      status: "Pending",
      requestDate: "2024-01-15",
      category: "Genetic Testing"
    },
    {
      id: 3,
      name: "Cardiovascular Analysis",
      status: "Pending",
      requestDate: "2024-01-10",
      category: "Cardiology"
    }
  ]);

  const [validatedRequests] = useState([
    {
      id: 2,
      name: "Targeted Genetic Panel",
      status: "Approved",
      requestDate: "2024-01-05",
      approvalDate: "2024-01-08",
      category: "Genetic Testing"
    }
  ]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      // This will be implemented later with actual password change logic
      console.log('Password change request:', passwordData);
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  };

  return (
    <main className="profile-content">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Manage your account settings and view your analysis requests</p>
        </div>
        
        <div className="profile-sections">
          {/* Password Change Section */}
          <div className="profile-section">
            <h2>Change Password</h2>
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className={passwordErrors.currentPassword ? 'error' : ''}
                />
                {passwordErrors.currentPassword && (
                  <span className="error-message">{passwordErrors.currentPassword}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className={passwordErrors.newPassword ? 'error' : ''}
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">{passwordErrors.newPassword}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className={passwordErrors.confirmPassword ? 'error' : ''}
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-message">{passwordErrors.confirmPassword}</span>
                )}
              </div>
              
              <button type="submit" className="change-password-btn">
                <i className="fas fa-key"></i>
                Change Password
              </button>
            </form>
          </div>
          
          {/* Requested Exomes Section */}
          <div className="profile-section">
            <h2>My Analysis Requests</h2>
            <div className="requests-list">
              {requestedExomes.map((exome) => (
                <div key={exome.id} className="request-item">
                  <div className="request-info">
                    <h4>{exome.name}</h4>
                    <p className="request-category">{exome.category}</p>
                    <p className="request-date">Requested: {exome.requestDate}</p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(exome.status)}`}>
                    {exome.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Validated Requests Section */}
          <div className="profile-section">
            <h2>Approved Requests</h2>
            <div className="requests-list">
              {validatedRequests.map((exome) => (
                <div key={exome.id} className="request-item">
                  <div className="request-info">
                    <h4>{exome.name}</h4>
                    <p className="request-category">{exome.category}</p>
                    <p className="request-date">Requested: {exome.requestDate}</p>
                    <p className="approval-date">Approved: {exome.approvalDate}</p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(exome.status)}`}>
                    {exome.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
