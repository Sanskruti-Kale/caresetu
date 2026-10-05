import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import {
  Pill,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  User
} from 'lucide-react';

export const MedicinesPage = () => {
  const { medicines, todaySchedule, refreshData, activeDependent, activeDependentId } = useHealth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationDays, setDurationDays] = useState('15');
  const [reminderTimes, setReminderTimes] = useState(['08:30 AM']);
  const [instructions, setInstructions] = useState('After food');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Calculate calculated end date for preview
  const calcStart = new Date(startDate || new Date());
  const calcDuration = parseInt(durationDays, 10) || 15;
  const calcEnd = new Date(calcStart.getTime() + calcDuration * 24 * 60 * 60 * 1000);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!name || !dosage) return;

    setSubmitting(true);
    try {
      await api.medicines.add({
        name,
        dosage,
        frequency,
        startDate,
        durationDays: calcDuration,
        reminderTimes,
        instructions,
        prescribedBy: prescribedBy || 'Consulting Doctor',
        notes,
        dependentId: activeDependentId === 'self' ? null : activeDependentId
      });

      await refreshData();
      setIsAddModalOpen(false);
      setName('');
      setDosage('');
      setDurationDays('15');
      setPrescribedBy('');
      setNotes('');
    } catch (err) {
      alert(err.message || 'Failed to add medicine.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogDose = async (medicineId, status, time) => {
    try {
      await api.medicines.logDose(medicineId, { status, time });
      await refreshData();
    } catch (err) {
      alert(err.message || 'Failed to record dose.');
    }
  };

  // Compile compliance stats
  let totalTaken = 0;
  let totalMissed = 0;
  const allLogs = [];

  medicines.forEach(m => {
    (m.doseLogs || []).forEach(log => {
      allLogs.push({
        ...log,
        medicineName: m.name,
        dosage: m.dosage,
        medicineId: m._id
      });
      if (log.status === 'taken') totalTaken++;
      if (log.status === 'missed') totalMissed++;
    });
  });

  allLogs.sort((a, b) => new Date(b.date || b.loggedAt) - new Date(a.date || a.loggedAt));

  const activeMedicines = medicines.filter(m => m.status === 'active');
  const completedMedicines = medicines.filter(m => m.status === 'completed');

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">Medicine Management & Reminders</h1>
            {activeDependent && (
              <span className="badge badge-info">
                👶 {activeDependent.name} ({activeDependent.relationship})
              </span>
            )}
          </div>
          <p className="page-subtitle">
            Track daily doses, course durations, and missed intake logs without altering prescriptions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Safety Policy Box */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.825rem',
        color: '#475569'
      }}>
        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div>
          <strong>Duration & Missed Dose Rules:</strong> If a 15-day course is specified, reminder schedules automatically conclude after 15 days. Missed doses are strictly recorded in your history for compliance transparency — CareSetu never auto-modifies or doubles your prescribed dosage.
        </div>
      </div>

      {/* Today's Schedule Card */}
      <div className="cs-card" style={{ marginBottom: '2rem' }}>
        <div className="cs-card-header">
          <div className="cs-card-title">
            <Clock size={20} color="var(--primary)" />
            <span>Today’s Scheduled Reminders</span>
          </div>
          <span className="badge badge-info">
            {todaySchedule.filter(s => s.status === 'taken').length} of {todaySchedule.length} Completed Today
          </span>
        </div>

        {todaySchedule.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <Pill size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
            <p>No active medicine doses due today.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {todaySchedule.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: item.status === 'taken' ? '#f0fdf4' : item.status === 'missed' ? '#fff1f2' : '#ffffff',
                  border: `1.5px solid ${item.status === 'taken' ? '#86efac' : item.status === 'missed' ? '#fda4af' : '#e2e8f0'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ⏰ {item.time}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    <strong>Dosage:</strong> {item.dosage} • {item.frequency}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <strong>Instructions:</strong> {item.instructions}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Ends {new Date(item.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>

                  {item.status === 'taken' ? (
                    <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                      ✓ Dose Taken
                    </span>
                  ) : item.status === 'missed' ? (
                    <span className="badge badge-danger" style={{ fontSize: '0.85rem' }}>
                      ✕ Recorded Missed
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleLogDose(item.medicineId, 'taken', item.time)}
                      >
                        <Check size={14} /> Mark Taken
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleLogDose(item.medicineId, 'missed', item.time)}
                        style={{ color: 'var(--rose)' }}
                      >
                        <X size={14} /> Missed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Courses vs Completed Courses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="med-grid">
        {/* Active Courses */}
        <div className="cs-card">
          <div className="cs-card-header">
            <div className="cs-card-title">
              <Pill size={20} color="var(--emerald)" />
              <span>Active Prescribed Courses ({activeMedicines.length})</span>
            </div>
          </div>

          {activeMedicines.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No active medication courses.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeMedicines.map(med => (
                <div key={med._id} style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, color: '#0f172a' }}>{med.name}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: 600 }}>{med.dosage} • {med.frequency}</div>
                    </div>
                    <span className="badge badge-success">Active Course</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span>Course: <strong>{med.durationDays} Days</strong></span>
                    <span>Started: {new Date(med.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span>Reminders Stop: <strong>{new Date(med.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                  </div>
                  {med.prescribedBy && (
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Prescribed by: {med.prescribedBy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Courses */}
        <div className="cs-card">
          <div className="cs-card-header">
            <div className="cs-card-title">
              <RotateCcw size={18} color="#64748b" />
              <span>Completed Past Courses ({completedMedicines.length})</span>
            </div>
          </div>

          {completedMedicines.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No past completed courses.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {completedMedicines.map(med => (
                <div key={med._id} style={{
                  background: '#f1f5f9',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, color: '#334155' }}>{med.name} ({med.dosage})</div>
                    <span className="badge badge-other">Course Concluded</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Completed {med.durationDays}-day course on {new Date(med.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. Reminders deactivated.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Missed Doses & History Log */}
      <div className="cs-card">
        <div className="cs-card-header">
          <div className="cs-card-title">
            <AlertTriangle size={18} color="var(--amber)" />
            <span>Compliance History & Missed Doses Log ({allLogs.length})</span>
          </div>
        </div>

        {allLogs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No dose actions logged yet.</p>
        ) : (
          <div className="cs-table-container">
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Compliance Status</th>
                  <th>Clinical History Notes</th>
                </tr>
              </thead>
              <tbody>
                {allLogs.map((log, i) => (
                  <tr key={i}>
                    <td>{new Date(log.date || log.loggedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {log.time}</td>
                    <td style={{ fontWeight: 700 }}>{log.medicineName}</td>
                    <td>{log.dosage}</td>
                    <td>
                      <span className={`badge ${log.status === 'taken' ? 'badge-success' : 'badge-danger'}`}>
                        {log.status === 'taken' ? '✓ Taken' : '✕ Missed Dose'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {log.notes || (log.status === 'missed' ? 'Recorded for patient history. Prescription schedule maintained.' : 'Taken on time.')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Prescribed Medicine</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMedicine}>
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Telmisartan, Amoxicillin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Dosage *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 20 mg, 1 Tablet"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select
                    className="form-control"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Thrice daily">Thrice daily</option>
                    <option value="As needed">As needed (SOS)</option>
                  </select>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    className="form-control"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Automatic Stop calculation badge */}
              <div style={{
                background: '#f0fdfa',
                border: '1px solid #ccfbf1',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.8rem',
                color: '#0f766e',
                marginBottom: '1rem'
              }}>
                ℹ️ <strong>Auto-Stop Reminder:</strong> Based on {calcDuration} days course, reminders will automatically stop after <strong>{calcEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Reminder Time</label>
                  <select
                    className="form-control"
                    value={reminderTimes[0]}
                    onChange={(e) => setReminderTimes([e.target.value])}
                  >
                    <option value="07:00 AM">07:00 AM (Early Morning)</option>
                    <option value="08:30 AM">08:30 AM (Breakfast)</option>
                    <option value="01:30 PM">01:30 PM (Lunch)</option>
                    <option value="06:30 PM">06:30 PM (Evening)</option>
                    <option value="09:30 PM">09:30 PM (Bedtime)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Instructions</label>
                  <select
                    className="form-control"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  >
                    <option value="After food">After food</option>
                    <option value="Before food (empty stomach)">Before food (empty stomach)</option>
                    <option value="With food">With food</option>
                    <option value="At bedtime">At bedtime</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Prescribed By Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Ananya Gupta (Cardiologist)"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Schedule Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .med-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
