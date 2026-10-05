import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import {
  Clock,
  Filter,
  Plus,
  Calendar,
  User,
  Heart,
  Activity,
  Pill,
  FileText,
  Search,
  CheckCircle,
  X
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cardiology',
  'Laboratory',
  'Radiology',
  'Orthopedics',
  'General Medicine',
  'Dental',
  'Other'
];

export const TimelinePage = () => {
  const { timeline, refreshData, activeDependent, activeDependentId } = useHealth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // Add event form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('General Medicine');
  const [doctorOrSpecialty, setDoctorOrSpecialty] = useState('');
  const [description, setDescription] = useState('');
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [glucose, setGlucose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    try {
      await api.timeline.addEvent({
        title,
        date: eventDate,
        category,
        doctorOrSpecialty,
        description,
        vitals: { bp, pulse, glucose },
        eventType: 'visit',
        dependentId: activeDependentId === 'self' ? null : activeDependentId
      });
      await refreshData();
      setIsAddEventModalOpen(false);
      setTitle('');
      setDescription('');
      setDoctorOrSpecialty('');
      setBp('');
      setPulse('');
      setGlucose('');
    } catch (err) {
      alert(err.message || 'Failed to add event.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvents = timeline.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const docQuery = doctorSearch.toLowerCase();
    const matchesDoctor = !doctorSearch ||
      event.doctorOrSpecialty?.toLowerCase().includes(docQuery) ||
      event.title?.toLowerCase().includes(docQuery) ||
      event.description?.toLowerCase().includes(docQuery);

    return matchesCategory && matchesDoctor;
  });

  const getEventIcon = (eventType, cat) => {
    if (eventType === 'medicine') return <Pill size={18} color="#e11d48" />;
    if (eventType === 'report') return <FileText size={18} color="#0284c7" />;
    if (cat === 'Cardiology') return <Heart size={18} color="#e11d48" />;
    return <Activity size={18} color="#0d9488" />;
  };

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">Health Journey Timeline</h1>
            {activeDependent && (
              <span className="badge badge-info">
                👶 {activeDependent.name} ({activeDependent.relationship})
              </span>
            )}
          </div>
          <p className="page-subtitle">
            A continuous chronological record connecting doctor visits, lab reports, and medication changes.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddEventModalOpen(true)}
        >
          <Plus size={16} />
          <span>Log Doctor Visit / Health Event</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="cs-card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.825rem',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-light)',
                  backgroundColor: selectedCategory === cat ? 'var(--primary-light)' : '#ffffff',
                  color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search by Doctor or Keyword */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Filter by doctor, clinic, keyword..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              style={{ paddingLeft: '2.3rem', padding: '0.45rem 0.85rem 0.45rem 2.3rem', fontSize: '0.85rem' }}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Timeline Events Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Try resetting your filters or log your first medical consultation milestone.
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {/* Vertical Timeline Track */}
          <div style={{
            position: 'absolute',
            left: '17px',
            top: '12px',
            bottom: '12px',
            width: '3px',
            background: 'linear-gradient(180deg, #0284c7 0%, #0d9488 50%, #e2e8f0 100%)'
          }} />

          {filteredEvents.map((event, index) => (
            <div key={event._id || index} style={{ position: 'relative', marginBottom: '2rem' }}>
              {/* Timeline Icon Node */}
              <div style={{
                position: 'absolute',
                left: '-2.5rem',
                top: '0',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid var(--border-light)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}>
                {getEventIcon(event.eventType, event.category)}
              </div>

              {/* Event Card */}
              <div className="cs-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                      📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="badge badge-other" style={{ fontSize: '0.725rem' }}>
                      {event.category}
                    </span>
                  </div>

                  {event.doctorOrSpecialty && (
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      👨‍⚕️ {event.doctorOrSpecialty}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  {event.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: event.vitals && Object.keys(event.vitals).length > 0 ? '0.75rem' : 0 }}>
                  {event.description}
                </p>

                {/* Vitals Snapshot if recorded */}
                {event.vitals && Object.keys(event.vitals).filter(k => event.vitals[k]).length > 0 && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: '0.8rem'
                  }}>
                    {event.vitals.bp && (
                      <div><span style={{ color: '#64748b' }}>Blood Pressure:</span> <strong>{event.vitals.bp}</strong></div>
                    )}
                    {event.vitals.pulse && (
                      <div><span style={{ color: '#64748b' }}>Pulse:</span> <strong>{event.vitals.pulse}</strong></div>
                    )}
                    {event.vitals.glucose && (
                      <div><span style={{ color: '#64748b' }}>Blood Glucose:</span> <strong>{event.vitals.glucose}</strong></div>
                    )}
                    {event.vitals.weight && (
                      <div><span style={{ color: '#64748b' }}>Weight:</span> <strong>{event.vitals.weight}</strong></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Visit Modal */}
      {isAddEventModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddEventModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Log Health Event / Doctor Visit</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddEventModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label className="form-label">Event / Visit Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Cardiology Routine Follow-up"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Doctor / Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Ananya Gupta (Apollo Hospital)"
                  value={doctorOrSpecialty}
                  onChange={(e) => setDoctorOrSpecialty(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Notes / Summary</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Key discussion points, doctor advice, lifestyle recommendations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Vitals */}
              <div className="grid-cols-3">
                <div className="form-group">
                  <label className="form-label">Blood Pressure</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="120/80"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pulse (bpm)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="72"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Glucose (mg/dL)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="95"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddEventModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add to Timeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
