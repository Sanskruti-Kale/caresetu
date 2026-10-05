import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, Eye, Download, Trash2, GitCompare, Sparkles } from 'lucide-react';
import { ViewReportModal } from './ViewReportModal';
import { ConfirmDialog } from './ConfirmDialog';
import { api } from '../services/api';
import { useHealth } from '../context/HealthContext';

export const ReportCard = ({ report }) => {
  const navigate = useNavigate();
  const { refreshData } = useHealth();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getBadgeClass = (category) => {
    switch (category) {
      case 'Cardiology': return 'badge-cardio';
      case 'Laboratory': return 'badge-lab';
      case 'Radiology': return 'badge-radio';
      case 'Orthopedics': return 'badge-ortho';
      case 'General Medicine': return 'badge-general';
      default: return 'badge-other';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.reports.delete(report._id);
      await refreshData();
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="cs-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className={`badge ${getBadgeClass(report.category)}`}>
              {report.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
              <Calendar size={13} />
              <span>{new Date(report.dateOfReport).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Title */}
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
            {report.title}
          </h4>

          {/* Doctor / Facility */}
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
            <User size={13} color="var(--primary)" />
            <span>{report.doctorName}</span>
            {report.hospitalOrLab && (
              <span style={{ color: '#94a3b8' }}>• {report.hospitalOrLab}</span>
            )}
          </div>

          {/* Extracted Parameters Preview */}
          {(report.extractedParameters || []).length > 0 && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.65rem',
              marginBottom: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem'
            }}>
              {report.extractedParameters.slice(0, 3).map((p, idx) => (
                <div key={idx} style={{ fontSize: '0.75rem', color: '#334155' }}>
                  <span style={{ color: '#64748b' }}>{p.key}:</span>{' '}
                  <strong style={{
                    color: p.status === 'high' ? '#be123c' : p.status === 'low' ? '#b45309' : '#047857'
                  }}>
                    {p.value} {p.unit}
                  </strong>
                </div>
              ))}
              {report.extractedParameters.length > 3 && (
                <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 600 }}>
                  +{report.extractedParameters.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsViewModalOpen(true)}
            style={{ flex: 1 }}
          >
            <Eye size={14} />
            <span>View Details</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/what-changed?reportA=${report._id}`)}
            title="Compare with another report in 'What Changed?'"
          >
            <GitCompare size={14} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsConfirmDeleteOpen(true)}
            style={{ color: 'var(--rose)' }}
            title="Delete Report"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ViewReportModal
        report={report}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Medical Report?"
        message={`Are you sure you want to permanently delete "${report.title}"? This will also remove the corresponding milestone from your health timeline.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Report'}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
};
