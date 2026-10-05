import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import {
  User,
  ShieldCheck,
  Download,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle,
  AlertCircle,
  Lock,
  Phone,
  Droplet
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, resetDemoData, logout } = useAuth();
  const { reports, medicines, timeline, dependents, refreshData } = useHealth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [allergies, setAllergies] = useState(user?.allergies?.join(', ') || '');
  const [chronicConditions, setChronicConditions] = useState(user?.chronicConditions?.join(', ') || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(user?.emergencyContact?.relation || '');

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    try {
      await updateProfile({
        name,
        phone,
        bloodGroup,
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        chronicConditions: chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relation: emergencyRelation
        }
      });
      setStatusMsg('Health profile updated successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const fullVault = {
      exportTimestamp: new Date(),
      userProfile: user,
      medicalReports: reports,
      prescriptionsAndMedicines: medicines,
      healthTimeline: timeline,
      dependents: dependents
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullVault, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CareSetu_Health_Vault_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset all demo records back to baseline state for evaluation?')) {
      await resetDemoData();
      await refreshData();
      alert('Demo records reset to default state!');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.auth.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Health Profile & Privacy</h1>
          <p className="page-subtitle">
            Manage your personal medical identity, emergency contacts, and data sovereignty settings.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div style={{
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <CheckCircle size={18} />
          <span>{statusMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }} className="profile-grid">
        {/* Profile Information Form */}
        <div className="cs-card">
          <div className="cs-card-header">
            <div className="cs-card-title">
              <User size={20} color="var(--primary)" />
              <span>Medical Profile & Emergency Contacts</span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Email (Account ID)</label>
                <input
                  type="email"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ background: '#f1f5f9', color: '#64748b' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-control"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies (e.g. Penicillin, Sulfa)</label>
              <input
                type="text"
                className="form-control"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Comma separated"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chronic Health Conditions (e.g. Hypertension)</label>
              <input
                type="text"
                className="form-control"
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
                placeholder="Comma separated"
              />
            </div>

            {/* Emergency Contact */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>
                Primary Emergency Contact
              </h4>

              <div className="grid-cols-3">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Contact Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="e.g. Pooja Sharma"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Relationship</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="e.g. Spouse, Parent"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91..."
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Update Health Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Privacy, Export & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Data Sovereignty & Export */}
          <div className="cs-card">
            <div className="cs-card-header">
              <div className="cs-card-title">
                <ShieldCheck size={20} color="var(--emerald)" />
                <span>Patient Data Sovereignty</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Download a complete JSON export of all your medical reports, medication records, timeline milestones, and dependents.
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportData}
              style={{ width: '100%' }}
            >
              <Download size={16} />
              <span>Export Full Health Vault (JSON)</span>
            </button>
          </div>

          {/* Hackathon Viva Helper */}
          <div className="cs-card" style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.4rem' }}>
              ⚡ HACKATHON EVALUATOR CONTROL:
            </div>
            <p style={{ fontSize: '0.8rem', color: '#0c4a6e', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              Reset demo reports, prescriptions, and timeline back to original state if modified during testing.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetDemo}
              style={{ width: '100%', color: 'var(--primary)' }}
            >
              <RotateCcw size={14} />
              <span>Reset Demo Seed Records</span>
            </button>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="cs-card" style={{ borderColor: '#fecdd3' }}>
            <div className="cs-card-header" style={{ borderColor: '#fee2e2' }}>
              <div className="cs-card-title" style={{ color: '#be123c' }}>
                <Trash2 size={18} />
                <span>Permanently Delete Vault</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#991b1b', lineHeight: 1.5, marginBottom: '1rem' }}>
              In accordance with patient privacy rights, you can permanently erase your entire medical archive and all associated records.
            </p>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setIsDeleteModalOpen(true)}
              style={{ width: '100%' }}
            >
              <Trash2 size={16} />
              <span>Erase All Data & Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Permanently Delete CareSetu Health Vault?"
        message="This action is irreversible. All your uploaded prescriptions, lab reports, timeline milestones, and child records will be immediately erased."
        confirmText={isDeleting ? 'Erasing...' : 'Yes, Delete Everything'}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDanger={true}
      />

      <style>{`
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
