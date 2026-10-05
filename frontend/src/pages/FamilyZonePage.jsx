import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ReportCard } from '../components/ReportCard';
import { api } from '../services/api';
import {
  Users,
  Plus,
  ShieldCheck,
  Calendar,
  Baby,
  Syringe,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  UserCheck
} from 'lucide-react';

export const FamilyZonePage = () => {
  const { dependents, refreshData, setIsUploadModalOpen, setActiveDependentId } = useHealth();
  const [selectedDepId, setSelectedDepId] = useState(dependents[0]?._id || '');
  const [vaccinations, setVaccinations] = useState([]);
  const [loadingVac, setLoadingVac] = useState(false);
  const [isAddDepModalOpen, setIsAddDepModalOpen] = useState(false);
  const [isUpdateVacModalOpen, setIsUpdateVacModalOpen] = useState(false);
  const [selectedVac, setSelectedVac] = useState(null);

  // New Dependent Form
  const [depName, setDepName] = useState('');
  const [depRel, setDepRel] = useState('Child');
  const [depDob, setDepDob] = useState('2020-08-15');
  const [depGender, setDepGender] = useState('Male');
  const [depBlood, setDepBlood] = useState('B+');
  const [depAllergies, setDepAllergies] = useState('');
  const [depPediatrician, setDepPediatrician] = useState('');
  const [depNotes, setDepNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Update Vac Form
  const [vacStatus, setVacStatus] = useState('given');
  const [administeredBy, setAdministeredBy] = useState('');
  const [vacNotes, setVacNotes] = useState('');

  // Active dependent object
  const activeChild = dependents.find(d => d._id === selectedDepId) || dependents[0];

  useEffect(() => {
    if (dependents.length > 0 && !selectedDepId) {
      setSelectedDepId(dependents[0]._id);
    }
  }, [dependents]);

  // Load vaccinations when selected dependent changes
  useEffect(() => {
    if (activeChild) {
      loadVaccinations(activeChild._id);
    }
  }, [selectedDepId]);

  const loadVaccinations = async (depId) => {
    setLoadingVac(true);
    try {
      const res = await api.dependents.getVaccinations(depId);
      if (res.vaccinations) {
        setVaccinations(res.vaccinations);
      }
    } catch (err) {
      console.error('Failed to load vaccines:', err);
    } finally {
      setLoadingVac(false);
    }
  };

  const handleAddDependent = async (e) => {
    e.preventDefault();
    if (!depName) return;

    setSubmitting(true);
    try {
      const res = await api.dependents.add({
        name: depName,
        relationship: depRel,
        dateOfBirth: depDob,
        gender: depGender,
        bloodGroup: depBlood,
        allergies: depAllergies,
        pediatrician: depPediatrician,
        notes: depNotes
      });

      if (res.success && res.dependent) {
        await refreshData();
        setSelectedDepId(res.dependent._id);
        setIsAddDepModalOpen(false);
        setDepName('');
        setDepAllergies('');
        setDepPediatrician('');
        setDepNotes('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add dependent profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVaccine = async (e) => {
    e.preventDefault();
    if (!selectedVac) return;

    try {
      await api.dependents.updateVaccination(selectedVac._id, {
        status: vacStatus,
        administeredBy,
        notes: vacNotes
      });
      await loadVaccinations(activeChild._id);
      setIsUpdateVacModalOpen(false);
      setSelectedVac(null);
    } catch (err) {
      alert(err.message || 'Failed to update vaccine record.');
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'Age unknown';
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      years--;
    }
    return `${years} Years Old`;
  };

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">Family & Dependent Zone</h1>
            <span className="badge badge-info">Authorized Guardianship</span>
          </div>
          <p className="page-subtitle">
            Manage your children's and dependents' health records and vaccination milestones in strict privacy isolation.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddDepModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add Child / Dependent Profile</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div style={{
        background: '#faf5ff',
        border: '1px solid #e9d5ff',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.825rem',
        color: '#6b21a8'
      }}>
        <ShieldCheck size={20} color="#9333ea" style={{ flexShrink: 0 }} />
        <div>
          <strong>Strict Separation Guarantee:</strong> Children and dependents do not require individual phone numbers. As the legal parent or guardian, you manage their health vault while their medical records remain strictly partitioned from your adult profile.
        </div>
      </div>

      {/* Dependent Profile Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {dependents.map(dep => {
          const isSelected = activeChild?._id === dep._id;
          return (
            <button
              key={dep._id}
              type="button"
              onClick={() => setSelectedDepId(dep._id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{dep.relationship === 'Child' ? '👶' : '👤'}</span>
              <span>{dep.name}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500 }}>
                ({dep.relationship})
              </span>
            </button>
          );
        })}
      </div>

      {activeChild && (
        <div>
          {/* Active Profile Info Card */}
          <div className="cs-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {activeChild.relationship === 'Child' ? '👶' : '👤'}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    {activeChild.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.2rem' }}>
                    <span>{calculateAge(activeChild.dateOfBirth)}</span>
                    <span>•</span>
                    <span>Blood Group: <strong>{activeChild.bloodGroup || 'Not tested'}</strong></span>
                    <span>•</span>
                    <span>Pediatrician: <strong>{activeChild.pediatrician || 'Not assigned'}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setActiveDependentId(activeChild._id);
                    setIsUploadModalOpen(true);
                  }}
                >
                  <Plus size={14} /> Upload Report for {activeChild.name.split(' ')[0]}
                </button>
              </div>
            </div>

            {activeChild.allergies && activeChild.allergies.length > 0 && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem'
              }}>
                <span style={{ color: '#be123c', fontWeight: 700 }}>Known Allergies:</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {activeChild.allergies.map((all, i) => (
                    <span key={i} className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                      {all}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Child Immunization & Vaccination Schedule */}
          <div className="cs-card" style={{ marginBottom: '2rem' }}>
            <div className="cs-card-header">
              <div className="cs-card-title">
                <Syringe size={20} color="var(--primary)" />
                <span>Immunization & Vaccine Schedule</span>
              </div>
              <span className="badge badge-info">
                IAP Recommended Protocol
              </span>
            </div>

            {vaccinations.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No vaccination schedule initialized for this profile.
              </p>
            ) : (
              <div className="cs-table-container">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Vaccine Name</th>
                      <th>Target Age</th>
                      <th>Immunization Status</th>
                      <th>Administered At / Batch</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.map(vac => (
                      <tr key={vac._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{vac.vaccineName}</div>
                          {vac.notes && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{vac.notes}</div>}
                        </td>
                        <td>{vac.targetAge}</td>
                        <td>
                          <span className={`badge ${
                            vac.status === 'given' ? 'badge-success' :
                            vac.status === 'due' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {vac.status === 'given' ? '✓ Given' : vac.status === 'due' ? '⚠️ Due Now' : 'Upcoming'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.825rem', color: '#475569' }}>
                          {vac.administeredBy || 'Not administered'}
                          {vac.batchNumber && <span> (Batch: {vac.batchNumber})</span>}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setSelectedVac(vac);
                              setVacStatus(vac.status);
                              setAdministeredBy(vac.administeredBy || '');
                              setVacNotes(vac.notes || '');
                              setIsUpdateVacModalOpen(true);
                            }}
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Dependent Modal */}
      {isAddDepModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddDepModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Child or Dependent</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddDepModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDependent}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Aarav Sharma"
                  value={depName}
                  onChange={(e) => setDepName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Relationship *</label>
                  <select
                    className="form-control"
                    value={depRel}
                    onChange={(e) => setDepRel(e.target.value)}
                  >
                    <option value="Child">Child (Son / Daughter)</option>
                    <option value="Parent">Elderly Parent (Mother / Father)</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other Dependent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={depDob}
                    onChange={(e) => setDepDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    value={depGender}
                    onChange={(e) => setDepGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-control"
                    value={depBlood}
                    onChange={(e) => setDepBlood(e.target.value)}
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pediatrician / Primary Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Sandeep Verma (Child Care Clinic)"
                  value={depPediatrician}
                  onChange={(e) => setDepPediatrician(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Allergies (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Peanuts, Penicillin, Dust"
                  value={depAllergies}
                  onChange={(e) => setDepAllergies(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddDepModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating Profile...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Vaccine Modal */}
      {isUpdateVacModalOpen && selectedVac && (
        <div className="modal-overlay" onClick={() => setIsUpdateVacModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Update Immunization: {selectedVac.vaccineName}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsUpdateVacModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateVaccine}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={vacStatus}
                  onChange={(e) => setVacStatus(e.target.value)}
                >
                  <option value="given">✓ Given / Administered</option>
                  <option value="due">⚠️ Due Now</option>
                  <option value="upcoming">Upcoming Schedule</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Administering Clinic / Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Child Care Clinic, Gurugram"
                  value={administeredBy}
                  onChange={(e) => setAdministeredBy(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Notes / Batch No</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Batch BAT-9021, Well tolerated"
                  value={vacNotes}
                  onChange={(e) => setVacNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsUpdateVacModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vaccine Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
