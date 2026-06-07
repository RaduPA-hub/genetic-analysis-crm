import React, { useEffect, useState } from 'react';
import './FamilyPage.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

const FamilyPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [exomes, setExomes] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedExomeId, setSelectedExomeId] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const getFamilyRelationLabel = (relation) => {
    const relations = {
      1: 'Proband',
      2: 'Mother',
      3: 'Father',
      4: 'Sibling',
      5: 'GrandmotherM',
      6: 'GrandfatherM',
      7: 'GrandfatherF',
      8: 'GrandfatherF',
      9: 'Aunt',
      10: 'Uncle',
      11: 'Cousin',
      12: 'Other'
    };
  
    return relations[relation] || 'Unknown';
  };
  const fetchFamilies = async () => {
    const res = await fetch( `${API_URL}/api/families?doctorId=${currentUser.id}`
    );
    const data = await res.json();
    setFamilies(data.families || []);
  };
  const addPatientToFamily = () => {
    const family = families.find((f) => f.id_family === selectedFamily);
  
    if (!family) {
      alert('Please select a family first');
      return;
    }
  
    navigate('/patient-registration', {
      state: {
        mode: 'family',
        familyData: family
      }
    });
  };
  const fetchFamilyPatients = async (familyId) => {
    setSelectedFamily(familyId);
    setSelectedPatients([]);

    const res = await fetch(`${API_URL}/api/families/${familyId}/patients?doctorId=${currentUser.id}`);
    const data = await res.json();
    setPatients(data.patients || []);
  };

  const createFamily = async () => {
    try {
      const res = await fetch(`${API_URL}/api/families`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_credentials: currentUser.id
        })
      });
  
      const data = await res.json();
  
      if (data.status !== 'ok') {
  console.error('REQUEST ERROR:', data);
  alert(data.message || 'Failed to request analysis');
  return;
}
  
      await fetchFamilies();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to request analysis');
    }
  };
  const deleteFamily = async (familyId) => {
    const confirmed = window.confirm('Are you sure you want to delete this family?');
  
    if (!confirmed) return;
  
    try {
      const doctorId = currentUser?.id || currentUser?.id_credentials;
  
      const res = await fetch(
        `${API_URL}/api/families/${familyId}?doctorId=${doctorId}`,
        { method: 'DELETE' }
      );
  
      const data = await res.json();
  
      if (data.status !== 'ok') {
        alert(data.message || 'Failed to delete family');
        return;
      }
  
      if (selectedFamily === familyId) {
        setSelectedFamily(null);
        setPatients([]);
        setSelectedPatients([]);
      }
  
      await fetchFamilies();
    } catch (err) {
      console.error(err);
      alert('Failed to delete family');
    }
  };
  const togglePatient = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const selectEntireFamily = () => {
    setSelectedPatients(patients.map((p) => p.id_pacient));
  };
  const fetchExomes = async () => {
  try {
    const res = await fetch('/api/exomes');
    const data = await res.json();

    if (data.status === 'ok') {
      setExomes(data.exomes || []);
    }
  } catch (err) {
    console.error('Error fetching exomes:', err);
  }
};

const openRequestModal = async () => {
  if (selectedPatients.length === 0) {
    alert('Please select at least one patient first');
    return;
  }

  await fetchExomes();
  setSelectedExomeId('');
  setShowRequestModal(true);
};

const selectedExome = exomes.find(
  (exome) => String(exome.id_exome) === String(selectedExomeId)
);

const selectedCount = selectedPatients.length;

const canFitSelectedGroup =
  selectedExome && selectedCount <= selectedExome.available_slots;

const confirmExomeRequest = async () => {
  if (!selectedExome) {
    alert('Please select an analysis');
    return;
  }

  try {
    setRequestLoading(true);

    const doctorId = currentUser?.id || currentUser?.id_credentials;

    const res = await fetch('/api/family-exome-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_credentials: doctorId,
        id_exome: selectedExome.id_exome,
        patient_ids: selectedPatients
      })
    });

    const data = await res.json();

    if (data.status !== 'ok') {
      alert(data.message || 'Failed to request analysis');
      return;
    }

    alert(data.message);
    setShowRequestModal(false);
    setSelectedExomeId('');
    setSelectedPatients([]);
    await fetchFamilyPatients(selectedFamily);
  } catch (err) {
    console.error(err);
    alert('Failed to request analysis');
  } finally {
    setRequestLoading(false);
  }
};
  useEffect(() => {
    fetchFamilies();
  }, []);

  return (
    <div className="family-page">
      <div className="family-hero">
        <div>
          <h1>Families</h1>
          <p>Create and manage patient families for analysis requests.</p>
        </div>
  
        <button className="family-create-btn" onClick={createFamily}>
          <i className="fas fa-plus"></i>
          Create New Family
        </button>
      </div>
  
      {families.length === 0 ? (
        <div className="empty-family-state">
          <h2>No families yet</h2>
          <p>Create your first family to start grouping patients.</p>
        </div>
      ) : (
        <div className="family-grid">
          {families.map((family) => (
            <div key={family.id_family} className="family-card">
              <div className="family-card-top">
                <span className="family-id-pill">
                  <i className="fas fa-users"></i>
                  {family.identifier}
                </span>
              </div>
  
              <h2>Family Record</h2>
              <p>Managed patient group</p>
  
              <div className="family-stats">
                <div className="family-stat">
                  <strong>{family.patient_count}</strong>
                  <span>Patients</span>
                </div>
              </div>
  
              <div className="family-card-actions">
                <button
                  className="family-action-primary"
                  onClick={() => fetchFamilyPatients(family.id_family)}
                >
                  View Patients
                </button>
  
                <button
                  className="family-action-secondary"
                  onClick={() => fetchFamilyPatients(family.id_family)}
                >
                  Select
                </button>

                <button
                    className="family-action-danger"
                    onClick={() => deleteFamily(family.id_family)}
                    >
                    Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
  
      {selectedFamily && (
        <div className="family-details-panel">
          <div className="family-details-header">
            <div>
                <h2>Family Patients</h2>
                <p>Select patients from this family for an analysis request.</p>
            </div>

            <div className="family-details-actions">
                
                <button className="family-action-primary" onClick={addPatientToFamily}>
                <i className="fas fa-user-plus"></i>
                Add Patient
                </button>

                <button className="family-action-primary" onClick={openRequestModal}>
                  <i className="fas fa-dna"></i>
                  Request Analysis
                </button>

                <button className="family-action-secondary" onClick={selectEntireFamily}>
                Select Entire Family
                </button>
            </div>
            </div>
  
          {patients.length === 0 ? (
            <p>This family has no patients yet.</p>
          ) : (
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Patient</th>
                  <th>Family Relation</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id_pacient}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(patient.id_pacient)}
                        onChange={() => togglePatient(patient.id_pacient)}
                      />
                    </td>
                    <td>
                        {patient.initials || `Patient #${patient.id_pacient}`}
                    </td>

                    <td>
                        {getFamilyRelationLabel(patient.family_relation)}
                    </td>

                    <td>
                        {patient.id_pacient}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
  
          <div className="selection-box">
            Selected patients: {selectedPatients.length}
          </div>
        </div>
      )}
          {showRequestModal && (
      <div className="family-modal-overlay">
        <div className="family-modal">
          <div className="family-modal-header">
            <div>
              <h2>Request Analysis</h2>
              <p>{selectedCount} selected patient(s)</p>
            </div>

            <button
              className="family-modal-close"
              onClick={() => setShowRequestModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="family-modal-body">
            <label className="family-modal-label">
              Choose analysis
            </label>

            <select
              className="family-modal-select"
              value={selectedExomeId}
              onChange={(e) => setSelectedExomeId(e.target.value)}
            >
              <option value="">Select an analysis</option>
              {exomes.map((exome) => (
                <option key={exome.id_exome} value={exome.id_exome}>
                  {exome.name} — {exome.available_slots} / {exome.slot} available
                </option>
              ))}
            </select>

            {selectedExome && (
              <div
                className={`request-status-box ${
                  canFitSelectedGroup ? 'can-fit' : 'waitlist'
                }`}
              >
                <h3>
                  {canFitSelectedGroup
                    ? 'This group can fit in the selected analysis.'
                    : 'This group cannot fit right now.'}
                </h3>

                <p>
                  {canFitSelectedGroup
                    ? 'The request will be sent for this analysis.'
                    : 'The request will be sent to the waitlist until enough room is available.'}
                </p>

                <div className="request-capacity-row">
                  <span>Selected patients</span>
                  <strong>{selectedCount}</strong>
                </div>

                <div className="request-capacity-row">
                  <span>Available capacity</span>
                  <strong>{selectedExome.available_slots}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="family-modal-footer">
            <button
              className="family-action-secondary"
              onClick={() => setShowRequestModal(false)}
            >
              Cancel
            </button>

            <button
              className="family-action-primary"
              onClick={confirmExomeRequest}
              disabled={!selectedExome || requestLoading}
            >
              {requestLoading
                ? 'Submitting...'
                : canFitSelectedGroup
                  ? 'Request access for this analysis'
                  : 'Request access for the waitlist'}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default FamilyPage;
