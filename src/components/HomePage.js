import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  // Mock data for exomes - this will come from backend later
  const [exomes] = useState([
    {
      id: 1,
      name: "Whole Exome Sequencing",
      description: "Comprehensive analysis of protein-coding regions of the genome",
      category: "Genetic Testing",
      duration: "2-3 weeks"
    },
    {
      id: 2,
      name: "Targeted Exome Panel",
      description: "Focused analysis of specific disease-related genes",
      category: "Genetic Testing",
      duration: "1-2 weeks"
    },
    {
      id: 3,
      name: "Cardiovascular Exome",
      description: "Specialized panel for cardiovascular genetic disorders",
      category: "Cardiology",
      duration: "1-2 weeks"
    },
    {
      id: 4,
      name: "Neurological Exome",
      description: "Comprehensive analysis of neurological genetic conditions",
      category: "Neurology",
      duration: "2-3 weeks"
    },
    {
      id: 5,
      name: "Oncology Exome",
      description: "Cancer-related genetic mutation analysis",
      category: "Oncology",
      duration: "1-2 weeks"
    },
    {
      id: 6,
      name: "Pediatric Exome",
      description: "Specialized analysis for pediatric genetic disorders",
      category: "Pediatrics",
      duration: "2-3 weeks"
    }
  ]);

  const handleRequest = (exomeId) => {
    // This will be implemented later with actual request logic
    console.log(`Request submitted for exome ID: ${exomeId}`);
    alert(`Request submitted for ${exomes.find(e => e.id === exomeId)?.name}`);
  };

  return (
    <main className="home-content">
      <div className="home-container">
        <div className="welcome-section">
          <h1>Available Exomes</h1>

        </div>
        
        <div className="exomes-grid">
          {exomes.map((exome) => (
            <div key={exome.id} className="exome-card">
              <div className="exome-header">
                <h3>{exome.name}</h3>
                <span className="exome-category">{exome.category}</span>
              </div>
              
              <div className="exome-content">
                <p className="exome-description">{exome.description}</p>
                
                <div className="exome-details">
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>Duration: {exome.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="exome-actions">
                <button 
                  className="request-btn"
                  onClick={() => handleRequest(exome.id)}
                >
                  <i className="fas fa-paper-plane"></i>
                  Request Access
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomePage; 