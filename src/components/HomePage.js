import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [exomes, setExomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch exomes from API
  const fetchExomes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exomes');
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

  useEffect(() => {
    fetchExomes();
  }, []);

  const handleRequest = (exomeId) => {
    const exome = exomes.find(e => e.id_exome === exomeId);
    if (exome) {
      navigate('/patient-registration', { 
        state: { exomeData: exome } 
      });
    }
  };

  return (
    <main className="home-content">
      <div className="home-container">
        <div className="welcome-section">
          <h1>Available Analyses</h1>
        </div>
        
        {loading ? (
          <div className="loading-message">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading analyses...</p>
          </div>
        ) : (
          <div className="exomes-grid">
            {exomes.map((exome) => (
              <div key={exome.id_exome} className="exome-card">
                <div className="exome-header">
                  <h3>{exome.name}</h3>
                  {exome.tag && (
                    <span className="exome-tag">{exome.tag}</span>
                  )}
                </div>
                
                <div className="exome-content">
                  <p className="exome-description">{exome.description}</p>
                  
                  <div className="exome-details">
                    <div className="slot-info">
                      <i className="fas fa-users"></i>
                      <span>Available Capacity: {exome.available_slots} / {exome.slot}</span>
                    </div>
                    <div className="exome-meta">
                      <div className="detail-item">
                        <i className="fas fa-cog"></i>
                        <span>Analysis Runs: {exome.runs}</span>
                      </div>
                      {exome.batch && (
                        <div className="detail-item">
                          <i className="fas fa-tag"></i>
                          <span>Batch: {exome.batch}</span>
                        </div>
                      )}
                    </div>
                    <div className="status-info">
                      <span className={`status ${exome.status.toLowerCase()}`}>
                        {exome.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="exome-actions">
                  <button 
                    className={`request-btn ${exome.available_slots <= 0 ? 'disabled' : ''}`}
                    onClick={() => handleRequest(exome.id_exome)}
                    disabled={exome.available_slots <= 0}
                  >
                    <i className="fas fa-paper-plane"></i>
                    {exome.available_slots <= 0 ? 'No Analysis Capacity' : 'Request Analysis'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
