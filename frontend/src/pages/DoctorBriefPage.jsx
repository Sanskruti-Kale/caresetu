import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import {
  Stethoscope,
  Share2,
  Printer,
  ShieldCheck,
  CheckCircle,
  Clock,
  Pill,
  FileText,
  AlertTriangle,
  Lock,
  Key,
  XCircle,
  Copy,
  UserCheck
} from 'lucide-react';

export const DoctorBriefPage = () => {
  const { user } = useAuth();
  const { activeDependentId } = useHealth();

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'consents' | 'portal'
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consents, setConsents] = useState([]);

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Ananya Gupta');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [generatedConsent, setGeneratedConsent] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);

  // Doctor Access Portal state
  const [portalCode, setPortalCode] = useState('CARE-9281');
  const [portalResult, setPortalResult] = useState(null);
  const [portalError, setPortalError] = useState('');
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    loadBrief();
    loadConsents();
  }, [activeDependentId]);

  const loadBrief = async () => {
    setLoading(true);
    try {
      const q = activeDependentId === 'self' ? {} : { dependentId: activeDependentId };
      const res = await api.doctorBrief.getBrief(q);
      if (res.success && res.brief) {
        setBrief(res.brief);
      }
    } catch (err) {
      console.error('Failed to load doctor brief:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConsents = async () => {
    try {
      const res = await api.doctorBrief.getConsents();
      if (res.consents) setConsents(res.consents);
    } catch (err) {
      console.error('Failed to load consents:', err);
    }
  };

  const handleCreateShare = async (e) => {
    e.preventDefault();
    if (!consentAcknowledged) {
      alert('Explicit user consent is mandatory to grant record access.');
      return;
    }

    setShareLoading(true);
    try {
      const res = await api.doctorBrief.shareConsent({
        doctorName,
        doctorEmail,
        dependentId: activeDependentId === 'self' ? null : activeDependentId
      });

      if (res.success && res.consent) {
        setGeneratedConsent(res.consent);
        loadConsents();
      }
    } catch (err) {
      alert(err.message || 'Failed to create doctor sharing consent.');
    } finally {
      setShareLoading(false);
    }
  };

  const handleRevoke = async (consentId) => {
    try {
      await api.doctorBrief.revokeConsent(consentId);
      loadConsents();
      alert('Access revoked immediately. The doctor can no longer view these records.');
    } catch (err) {
      alert(err.message || 'Failed to revoke access.');
    }
  };

  const handleDoctorAccessSubmit = async (e) => {
    e.preventDefault();
    setPortalLoading(true);
    setPortalError('');
    setPortalResult(null);

    try {
      const res = await api.doctorBrief.doctorAccessByCode(portalCode.trim());
      if (res.success) {
        setPortalResult(res);
      } else {
        setPortalError(res.message || 'Invalid or expired access code.');
      }
    } catch (err) {
      setPortalError(err.message || 'Invalid or revoked code.');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">Doctor Consultation Brief</h1>
            <span className="badge badge-success">Explicit Patient Consent</span>
          </div>
          <p className="page-subtitle">
            Generate a concise 1-page consultation brief and share with your doctor via temporary, revocable access codes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setGeneratedConsent(null);
              setIsShareModalOpen(true);
            }}
          >
            <Share2 size={16} />
            <span>Share with Doctor (Consent-Based)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'summary' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'summary' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'summary' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          📄 Consultation Brief
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consents')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'consents' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'consents' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'consents' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Lock size={15} />
          <span>Active Sharing Consents ({consents.filter(c => c.status === 'active').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portal')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'portal' ? 'var(--primary-light)' : 'transparent',
            color: activeTab === 'portal' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'portal' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Key size={15} />
          <span>Doctor Access Verification Portal</span>
        </button>
      </div>

      {/* TAB 1: CONSULTATION BRIEF SHEET */}
      {activeTab === 'summary' && brief && (
        <div className="cs-card" style={{ padding: '2.5rem', maxWidth: '960px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }} id="printable-brief">
          {/* Clinical Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                CareSetu CLINICAL CONSULTATION BRIEF
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                {brief.patient.name}
              </h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Blood Group: <strong>{brief.patient.bloodGroup || 'O+'}</strong> • Gender: <strong>{brief.patient.gender || 'Male'}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="badge badge-info" style={{ marginBottom: '0.35rem' }}>
                Verified Patient Vault
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Generated: {new Date(brief.generatedAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Allergies & Chronic Conditions Alert */}
          <div style={{
            background: '#fff1f2',
            border: '1.5px solid #fda4af',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <div>
              <span style={{ fontWeight: 800, color: '#9f1239' }}>KNOWN ALLERGIES: </span>
              <span style={{ color: '#881337', fontWeight: 600 }}>
                {brief.patient.allergies?.length ? brief.patient.allergies.join(', ') : 'No known drug allergies reported'}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 800, color: '#0369a1' }}>CHRONIC CONDITIONS: </span>
              <span style={{ color: '#075985', fontWeight: 600 }}>
                {brief.patient.chronicConditions?.length ? brief.patient.chronicConditions.join(', ') : 'None listed'}
              </span>
            </div>
          </div>

          {/* Vitals Summary Strip */}
          {Object.keys(brief.latestVitals).length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
                LATEST CLINICAL VITALS SNAPSHOT
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {Object.entries(brief.latestVitals).map(([key, vit]) => (
                  <div key={key} style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{key}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: vit.status === 'high' ? '#be123c' : '#0f766e' }}>
                      {vit.value} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{vit.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Medicines Section */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Pill size={16} color="var(--primary)" />
              CURRENT ACTIVE MEDICATIONS
            </h4>

            {brief.activeMedicines.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No active medications listed.</p>
            ) : (
              <div className="cs-table-container">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage & Frequency</th>
                      <th>Instructions</th>
                      <th>Prescribed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.activeMedicines.map((m, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                        <td>{m.dosage} • {m.frequency}</td>
                        <td style={{ color: '#475569' }}>{m.instructions}</td>
                        <td style={{ color: '#64748b' }}>{m.prescribedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Reports Summary */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="var(--teal)" />
              RECENT REPORTS & DIAGNOSTIC LABS
            </h4>

            <div className="cs-table-container">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Report Title</th>
                    <th>Category</th>
                    <th>Doctor</th>
                    <th>Extracted Key Parameters</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.recentReports.map(rep => (
                    <tr key={rep.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(rep.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ fontWeight: 700 }}>{rep.title}</td>
                      <td><span className="badge badge-other">{rep.category}</span></td>
                      <td style={{ color: '#475569' }}>{rep.doctorName}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {rep.keyParameters.map((p, idx) => (
                          <span key={idx} style={{ marginRight: '0.5rem', color: '#0369a1' }}>
                            {p.key}: <strong>{p.value}</strong>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline Highlights */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="#7e22ce" />
              TIMELINE HIGHLIGHTS & DOCTOR VISITS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {brief.recentTimelineHighlights.map((t, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.title}</span>
                    <span style={{ fontSize: '0.775rem', color: '#64748b', marginLeft: '0.5rem' }}>({t.doctor})</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer Footer */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1rem',
            fontSize: '0.75rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheck size={18} color="var(--emerald)" />
            <span>{brief.safetyDisclaimer}</span>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SHARING CONSENTS */}
      {activeTab === 'consents' && (
        <div className="cs-card">
          <div className="cs-card-header">
            <div className="cs-card-title">
              <Lock size={20} color="var(--primary)" />
              <span>Active & Historical Doctor Sharing Consents</span>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            You maintain 100% control over who sees your health summary. Any shared link can be revoked instantly.
          </div>

          {consents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No sharing consents active.</p>
          ) : (
            <div className="cs-table-container">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Doctor / Clinic Name</th>
                    <th>Temporary Access Code</th>
                    <th>Status</th>
                    <th>Expires At</th>
                    <th>Access Log Activity</th>
                    <th>Revoke Access</th>
                  </tr>
                </thead>
                <tbody>
                  {consents.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 700 }}>{c.doctorName}</td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800, color: 'var(--primary)' }}>
                          {c.accessCode}
                        </code>
                      </td>
                      <td>
                        <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.825rem', color: '#475569' }}>
                        {new Date(c.expiresAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {c.accessLog?.length ? `${c.accessLog.length} view(s)` : 'Not yet accessed'}
                      </td>
                      <td>
                        {c.status === 'active' ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRevoke(c._id)}
                          >
                            <XCircle size={14} />
                            <span>Revoke Now</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Revoked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOCTOR VERIFICATION PORTAL */}
      {activeTab === 'portal' && (
        <div className="cs-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#e0f2fe',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem'
            }}>
              <Key size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Doctor Consultation Access Portal</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Enter the patient’s authorized 6-character CareSetu access code (e.g. <code>CARE-9281</code>)
            </p>
          </div>

          <form onSubmit={handleDoctorAccessSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. CARE-9281"
              value={portalCode}
              onChange={(e) => setPortalCode(e.target.value.toUpperCase())}
              style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center' }}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={portalLoading}>
              {portalLoading ? 'Verifying...' : 'Access Brief'}
            </button>
          </form>

          {portalError && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {portalError}
            </div>
          )}

          {portalResult && (
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 800, marginBottom: '0.5rem' }}>
                <CheckCircle size={18} /> Verified Patient Consent Access Granted
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Patient: {portalResult.patient.name}
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                Blood Group: {portalResult.patient.bloodGroup} • Allergies: {portalResult.patient.allergies?.join(', ') || 'None'}
              </div>

              <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Authorized Active Medications ({portalResult.medicines?.length || 0}):
              </div>
              <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {portalResult.medicines?.map((m, idx) => (
                  <li key={idx} style={{ background: '#ffffff', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    💊 {m.name} ({m.dosage}) — {m.frequency}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Share with Doctor Modal */}
      {isShareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Share Summary with Doctor</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsShareModalOpen(false)}>
                <XCircle size={20} />
              </button>
            </div>

            {generatedConsent ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Consent Code Generated!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Share this 6-character secure code with <strong>{generatedConsent.doctorName}</strong> during your consultation:
                </p>

                <div style={{
                  background: '#f0fdfa',
                  border: '2px dashed #0d9488',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#0f766e',
                  marginBottom: '1rem'
                }}>
                  {generatedConsent.accessCode}
                </div>

                <div style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  Valid for 24 hours. You can revoke this permission anytime from your Profile or Sharing tab.
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateShare}>
                <div className="form-group">
                  <label className="form-label">Doctor / Clinic Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dr. Ananya Gupta (Cardiologist)"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor Email (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="dr.gupta@hospital.com"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                  />
                </div>

                {/* Mandatory Explicit Consent Checkbox */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #bae6fd',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: '#0f172a' }}>
                    <input
                      type="checkbox"
                      checked={consentAcknowledged}
                      onChange={(e) => setConsentAcknowledged(e.target.checked)}
                      style={{ marginTop: '3px', width: '18px', height: '18px' }}
                    />
                    <span>
                      <strong>Explicit Consent Declaration:</strong> I authorize CareSetu to generate a temporary 24-hour access code allowing <strong>{doctorName || 'the doctor'}</strong> to view my consultation summary. I understand I can revoke this access at any time.
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsShareModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={shareLoading || !consentAcknowledged}>
                    {shareLoading ? 'Generating Code...' : 'Authorize & Generate Code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
