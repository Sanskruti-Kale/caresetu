import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ReportCard } from '../components/ReportCard';
import { api } from '../services/api';
import {
  FileText,
  Pill,
  Clock,
  Users,
  Upload,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  GitCompare,
  Stethoscope,
  Heart
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const {
    activeDependentId,
    activeDependent,
    dependents,
    reports,
    medicines,
    todaySchedule,
    timeline,
    stats,
    refreshData,
    setIsUploadModalOpen
  } = useHealth();

  // Handle Dose action directly from dashboard
  const handleLogDose = async (medicineId, status, time) => {
    try {
      await api.medicines.logDose(medicineId, { status, time });
      await refreshData();
    } catch (err) {
      alert(err.message || 'Error recording dose');
    }
  };

  const currentDisplayName = activeDependentId === 'self' 
    ? (user?.name || 'Rahul Sharma') 
    : activeDependent?.name;

  return (
    <div className="content-wrapper">
      {/* Top Safety Banner */}
      <DisclaimerBanner />

      {/* Greeting & Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">
              Namaste, {currentDisplayName} 👋
            </h1>
            {activeDependent && (
              <span className="badge badge-info">
                👶 {activeDependent.relationship} Profile
              </span>
            )}
          </div>
          <p className="page-subtitle">
            “Aapki Sehat, Aapki Kahani.” Here is your summarized health status today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload size={16} />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        {/* Stat 1: Total Reports */}
        <Link to="/records" className="cs-card" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Reports</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#e0f2fe',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            {stats.totalReports}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
            View categorized records →
          </div>
        </Link>

        {/* Stat 2: Active Medicines */}
        <Link to="/medicines" className="cs-card" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Medicines</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#ccfbf1',
              color: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            {stats.activeMedicines}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 600, marginTop: '0.25rem' }}>
            Duration tracked doses →
          </div>
        </Link>

        {/* Stat 3: Missed Doses Logged */}
        <Link to="/medicines" className="cs-card" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Missed Doses Logged</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fef3c7',
              color: 'var(--amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            {stats.totalMissedDoses}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 600, marginTop: '0.25rem' }}>
            Prescription schedule intact →
          </div>
        </Link>

        {/* Stat 4: Family Dependents */}
        <Link to="/family-zone" className="cs-card" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Family Dependents</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f3e8ff',
              color: '#7e22ce',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            {stats.dependentsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7e22ce', fontWeight: 600, marginTop: '0.25rem' }}>
            Isolated records & vaccines →
          </div>
        </Link>
      </div>

      {/* Main 2-Column Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.5rem', marginBottom: '2rem' }} className="dash-grid">
        {/* Left Column: Recent Reports & Timeline */}
        <div>
          {/* Recent Reports Section */}
          <div className="cs-card" style={{ marginBottom: '1.5rem' }}>
            <div className="cs-card-header">
              <div className="cs-card-title">
                <FileText size={20} color="var(--primary)" />
                <span>Recently Added Reports</span>
              </div>
              <Link to="/records" className="btn btn-secondary btn-sm">
                View All ({reports.length})
              </Link>
            </div>

            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p>No medical reports uploaded yet.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload size={14} /> Upload First Report
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {reports.slice(0, 2).map(rep => (
                  <ReportCard key={rep._id} report={rep} />
                ))}
              </div>
            )}
          </div>

          {/* Health Timeline Preview */}
          <div className="cs-card">
            <div className="cs-card-header">
              <div className="cs-card-title">
                <Clock size={20} color="var(--teal)" />
                <span>Health Timeline Preview</span>
              </div>
              <Link to="/timeline" className="btn btn-secondary btn-sm">
                Full Journey Timeline →
              </Link>
            </div>

            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {/* Timeline Vertical Line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '2px',
                backgroundColor: 'var(--border-light)'
              }} />

              {timeline.slice(0, 3).map((event, idx) => (
                <div key={idx} style={{ position: 'relative', marginBottom: '1.25rem' }}>
                  {/* Timeline Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-1.5rem',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid var(--primary)',
                    boxShadow: '0 0 0 2px #e0f2fe'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="badge badge-other" style={{ fontSize: '0.7rem' }}>
                      {event.category}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                    {event.title}
                  </h5>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Medicines & Family Overview */}
        <div>
          {/* Today's Medicine Reminders */}
          <div className="cs-card" style={{ marginBottom: '1.5rem' }}>
            <div className="cs-card-header">
              <div className="cs-card-title">
                <Pill size={20} color="var(--rose)" />
                <span>Today’s Medicine Schedule</span>
              </div>
              <Link to="/medicines" className="btn btn-secondary btn-sm">
                Manage
              </Link>
            </div>

            {todaySchedule.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No active medicine doses scheduled for today.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {todaySchedule.map((item, index) => (
                  <div key={index} style={{
                    background: item.status === 'taken' ? '#f0fdf4' : item.status === 'missed' ? '#fff1f2' : '#f8fafc',
                    border: `1px solid ${item.status === 'taken' ? '#bbf7d0' : item.status === 'missed' ? '#fecdd3' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a' }}>{item.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({item.dosage})</span>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                        ⏰ {item.time} • {item.instructions}
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div>
                      {item.status === 'taken' ? (
                        <span className="badge badge-success">✓ Taken</span>
                      ) : item.status === 'missed' ? (
                        <span className="badge badge-danger">✕ Missed</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => handleLogDose(item.medicineId, 'taken', item.time)}
                            title="Mark as Taken"
                          >
                            <CheckCircle size={14} />
                            <span>Take</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleLogDose(item.medicineId, 'missed', item.time)}
                            title="Log as Missed"
                            style={{ color: 'var(--rose)' }}
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Consult & What Changed Jump Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <Link to="/what-changed" className="cs-card" style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
              border: '1px solid #fde68a',
              textDecoration: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <GitCompare size={20} color="#b45309" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>
                  “What Changed?” Comparison
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#78350f', lineHeight: 1.5 }}>
                Compare two prescriptions or lab tests to inspect added/discontinued medications and blood pressure changes.
              </p>
            </Link>

            <Link to="/doctor-brief" className="cs-card" style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
              border: '1px solid #bae6fd',
              textDecoration: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <Stethoscope size={20} color="#0369a1" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#075985' }}>
                  Doctor Consultation Brief
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#0c4a6e', lineHeight: 1.5 }}>
                Generate a 1-page summary with active medicines and recent lab values. Share with your doctor via secure PIN.
              </p>
            </Link>
          </div>

          {/* Family Dependents Summary */}
          <div className="cs-card">
            <div className="cs-card-header">
              <div className="cs-card-title">
                <Users size={18} color="#7e22ce" />
                <span>Family Zone Overview</span>
              </div>
              <Link to="/family-zone" className="btn btn-secondary btn-sm">
                Open
              </Link>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Children & dependents managed under your authorized guardianship:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dependents.map(dep => (
                <div key={dep._id} style={{
                  background: '#faf5ff',
                  border: '1px solid #f3e8ff',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#581c87', fontSize: '0.875rem' }}>{dep.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7e22ce' }}>{dep.relationship} • Blood Group: {dep.bloodGroup}</div>
                  </div>
                  <Link to="/family-zone" className="badge badge-info" style={{ fontSize: '0.725rem' }}>
                    Vaccines & Growth →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
