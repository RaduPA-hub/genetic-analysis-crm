import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './PatientRegistrationPage.css';

// Validation schemas
const patientValidationSchema = Yup.object().shape({
  initials: Yup.string()
    .required('Initials are required')
    .min(2, 'Initials must be at least 2 characters')
    .max(10, 'Initials must be no more than 10 characters')
    .matches(/^[A-Za-z\s]+$/, 'Initials can only contain letters and spaces'),
  
  family_relation: Yup.number()
    .required('Family relation is required')
    .oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'Please select a valid family relation'),
  
  age: Yup.number()
    .required('Age is required')
    .min(0, 'Age must be 0 or greater')
    .max(120, 'Age must be 120 or less')
    .integer('Age must be a whole number'),
  
  sex: Yup.string()
    .required('Sex is required')
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid sex'),
  
  description: Yup.string()
    .max(500, 'Description must be no more than 500 characters'),
  
  family_identifier: Yup.string()
    .required('Family identifier is required')
    .min(1, 'Family identifier is required')
    .max(50, 'Family identifier must be no more than 50 characters')
});

const PatientRegistrationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exomeData, familyData, mode } = location.state || {};
  const isFamilyMode = mode === 'family';

  const [formData, setFormData] = useState({
    initials: '',
    family_relation: '',
    age: '',
    sex: '',
    description: '',
    family_identifier: familyData?.identifier || '',
    id_family: familyData?.id_family || null,
    hpo_terms: []
  });

  const [selectedHpoTerms, setSelectedHpoTerms] = useState([]);
  const [hpoSearchTerm, setHpoSearchTerm] = useState('');
  const [hpoSuggestions, setHpoSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Family relation options
  const familyRelationOptions = [
    { value: 1, label: 'Proband (Primary Patient)' },
    { value: 2, label: 'Mother' },
    { value: 3, label: 'Father' },
    { value: 4, label: 'Sibling' },
    { value: 5, label: 'GrandmotherM' },
    { value: 6, label: 'GrandfatherM' },
    { value: 7, label: 'GrandmotherF' },
    { value: 8, label: 'GrandfatherF' },
    { value: 9, label: 'Aunt' },
    { value: 10, label: 'Uncle' },
    { value: 11, label: 'Cousin' },
    { value: 12, label: 'Other' }
  ];

  // Sex options
  const sexOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  // Debounced search for HPO terms
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
    if (hpoSearchTerm.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        searchHpoTerms(hpoSearchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setHpoSuggestions([]);
      setShowSuggestions(false);
    }
  }, [hpoSearchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && !event.target.closest('.hpo-search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const searchHpoTerms = async (searchTerm) => {
    try {
      setLoading(true);
      
      // Use the proxy endpoint on our server
      const apiUrl = `/api/hpo-search?terms=${encodeURIComponent(searchTerm)}&maxList=10`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'ok' && result.data) {
        const data = result.data;
        
        // Check the actual structure of the response
        if (Array.isArray(data) && data.length >= 4) {
          const count = data[0]; // Number of results
          const ids = data[1] || []; // Array of HPO IDs
          const nullValue = data[2]; // Usually null
          const terms = data[3] || []; // Array of HPO names
          
          
          if (terms.length > 0 && ids.length > 0) {
            const suggestions = terms.map((term, index) => {
              const hpoId = ids[index] || `HPO:${index}`;
              
              // Each term is an array: [HPO_ID, TERM_NAME]
              let cleanName = 'Unknown term';
              if (Array.isArray(term) && term.length >= 2) {
                cleanName = term[1]; // Get the name from the second element
              } else if (typeof term === 'string') {
                cleanName = term;
              }
              
              return {
                id_hpo: hpoId,
                hpo_name: cleanName,
                hpo_id: hpoId
              };
            });
            setHpoSuggestions(suggestions);
            setShowSuggestions(true);
          } else {
            setHpoSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setHpoSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setHpoSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching HPO terms:', error);
      
      // Fallback to mock data for testing
      const mockSuggestions = [
        { id_hpo: 'HP:0001249', hpo_name: 'Intellectual disability', hpo_id: 'HP:0001249' },
        { id_hpo: 'HP:0001250', hpo_name: 'Seizures', hpo_id: 'HP:0001250' },
        { id_hpo: 'HP:0001263', hpo_name: 'Global developmental delay', hpo_id: 'HP:0001263' },
        { id_hpo: 'HP:0000717', hpo_name: 'Autism', hpo_id: 'HP:0000717' },
        { id_hpo: 'HP:0003324', hpo_name: 'Muscle weakness', hpo_id: 'HP:0003324' }
      ].filter(term => 
        term.hpo_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setHpoSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHpoSearchKeyDown = (e) => {
    if (!showSuggestions || hpoSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < hpoSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : hpoSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < hpoSuggestions.length) {
          handleHpoTermSelect(hpoSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleHpoTermSelect = (hpoTerm) => {
    setSelectedHpoTerms(prev => {
      const isSelected = prev.some(term => term.id_hpo === hpoTerm.id_hpo);
      if (!isSelected) {
        return [...prev, hpoTerm];
      }
      return prev;
    });
    setHpoSearchTerm('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleHpoTermRemove = (hpoTerm) => {
    setSelectedHpoTerms(prev => prev.filter(term => term.id_hpo !== hpoTerm.id_hpo));
  };

  const validateForm = async () => {
    try {
      await patientValidationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setValidationErrors(newErrors);
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    setLoading(true);
    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        family_relation: parseInt(formData.family_relation),
        hpo_terms: selectedHpoTerms.map(term => ({
          id_hpo: term.id_hpo,
          hpo_name: term.hpo_name
        }))
      };

      // Submit patient registration and exome request
      const response = await fetch(
        isFamilyMode ? '/api/family-patient-registration' : '/api/patient-registration',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isFamilyMode
            ? {
                patient: {
                  ...patientData,
                  id_family: familyData.id_family,
                  family_identifier: familyData.identifier
                }
              }
            : {
                patient: patientData,
                exome_id: exomeData.id_exome,
                exome_name: exomeData.name
              }
        ),
      });

      const data = await response.json();
      
      if (data.status === 'ok') {
        alert(
          isFamilyMode
            ? `Patient added successfully to ${familyData.identifier}`
            : `Patient registered successfully! Request submitted for ${exomeData.name}`
        );
        navigate('/');
      } else {
        throw new Error(data.message || 'Failed to register patient');
      }
    } catch (error) {
      console.error('Error submitting patient data:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!exomeData && !isFamilyMode)  {
    return (
      <div className="patient-registration-page">
        <div className="error-container">
          <h2>No Analysis Selected</h2>
          <p>Please select an analysis from the home page to register a patient.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-registration-page">
      <div className="page-header">
        <div className="header-content">
          <button onClick={handleCancel} className="back-btn">
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </button>
          <div className="header-info">
            <h1>Patient Registration</h1>
            <p>
            {isFamilyMode ? (
              <>Add patient to <strong>{familyData.identifier}</strong></>
            ) : (
              <>Register patient for <strong>{exomeData.name}</strong></>
            )}
          </p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-section">
            <h3>Patient Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="initials">Patient Initials *</label>
                <input
                  type="text"
                  id="initials"
                  name="initials"
                  value={formData.initials}
                  onChange={handleInputChange}
                  placeholder="e.g., J.D."
                  className={errors.initials ? 'error' : ''}
                />
                {errors.initials && <span className="error-message">{errors.initials}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age in years"
                  min="0"
                  max="120"
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sex">Sex *</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className={errors.sex ? 'error' : ''}
                >
                  <option value="">Select sex</option>
                  {sexOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.sex && <span className="error-message">{errors.sex}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="family_relation">Family Relation *</label>
                <select
                  id="family_relation"
                  name="family_relation"
                  value={formData.family_relation}
                  onChange={handleInputChange}
                  className={errors.family_relation ? 'error' : ''}
                >
                  <option value="">Select relation</option>
                  {familyRelationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.family_relation && <span className="error-message">{errors.family_relation}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="family_identifier">Family Identifier *</label>
              <input
                type="text"
                id="family_identifier"
                name="family_identifier"
                value={formData.family_identifier}
                onChange={handleInputChange}
                placeholder="e.g., FAM001"
                className={errors.family_identifier ? 'error' : ''}
              />
              {errors.family_identifier && <span className="error-message">{errors.family_identifier}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Clinical Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the patient's clinical presentation, symptoms, and relevant medical history..."
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>HPO Terms (Human Phenotype Ontology)</h3>
            <p className="section-description">
              Search and select relevant HPO terms that describe the patient's phenotype. Type at least 2 characters to search.
            </p>
            
            <div className="hpo-search-container">
              <div className="hpo-search">
                <input
                  type="text"
                  placeholder="Search HPO terms (e.g., 'intellectual disability', 'seizures')..."
                  className="hpo-search-input"
                  value={hpoSearchTerm}
                  onChange={(e) => setHpoSearchTerm(e.target.value)}
                  onFocus={() => hpoSearchTerm.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleHpoSearchKeyDown}
                />
                {loading && (
                  <div className="search-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                )}
              </div>

              {/* HPO Suggestions Dropdown */}
              {showSuggestions && hpoSuggestions.length > 0 && (
                <div className="hpo-suggestions">
                  {hpoSuggestions.map((term, index) => (
                    <div
                      key={term.id_hpo}
                      className={`hpo-suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                      onClick={() => handleHpoTermSelect(term)}
                    >
                      <div className="hpo-suggestion-content">
                        <span className="hpo-suggestion-name">
                          <span className="hpo-id">{term.id_hpo}</span>
                          <span className="hpo-name">{term.hpo_name}</span>
                        </span>
                      </div>
                      <i className="fas fa-plus-circle"></i>
                    </div>
                  ))}
                </div>
              )}

              {showSuggestions && hpoSuggestions.length === 0 && hpoSearchTerm.length >= 2 && !loading && (
                <div className="hpo-suggestions">
                  <div className="no-suggestions">
                    <i className="fas fa-search"></i>
                    <p>No HPO terms found matching your search.</p>
                  </div>
                </div>
              )}
            </div>

            {selectedHpoTerms.length > 0 && (
              <div className="selected-hpo-terms">
                <h4>Selected HPO Terms:</h4>
                <div className="selected-terms-list">
                  {selectedHpoTerms.map(term => (
                    <span key={term.id_hpo} className="selected-term">
                      <span className="term-name">{term.hpo_name}</span>
                      <span className="term-id">({term.id_hpo})</span>
                      <button
                        type="button"
                        onClick={() => handleHpoTermRemove(term)}
                        className="remove-term-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Registering Patient...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Register Patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationPage;
