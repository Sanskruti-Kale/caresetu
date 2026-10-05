import React from 'react';
import { X, FileText, Download, User, Calendar, Building, Sparkles, ShieldCheck } from 'lucide-react';

export const ViewReportModal = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  const handleDownload = () => {
    // Generate text/json medical record download
    const recordData = `CareSetu MEDICAL RECORD
Report Title: ${report.title}
Category: ${report.category}
Doctor/Specialist: ${report.doctorName}
Facility: ${report.hospitalOrLab || 'N/A'}
Report Date: ${new Date(report.dateOfReport).toLocaleDateString('en-IN')}
User Confirmed: ${report.userConfirmedCategory ? 'Yes' : 'Pending'}

EXTRACTED PARAMETERS:
${(report.extractedParameters || []).map(p => `- ${p.key}: ${p.value} ${p.unit} (Ref: ${p.referenceRange || 'N/A'}) [${p.status.toUpperCase()}]`).join('\n')}

EXTRACTED MEDICATIONS:
${(report.extractedMedications || []).map(m => `- ${m.name} (${m.dosage}): ${m.instruction}`).join('\n')}

NOTES:
${report.notes || 'None recorded'}

EXTRACTED TEXT:
${report.ocrExtractedText || 'N/A'}

====================================================
CareSetu - Aapki Sehat, Aapki Kahani.
Downloaded: ${new Date().toLocaleString()}
`;
    const blob = new Blob([recordData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}_CareSetu.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className={`badge ${getBadgeClass(report.category)}`}>
                {report.category}
              </span>
              {report.userConfirmedCategory && (
                <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                  ✓ User Confirmed Category
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{report.title}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Meta Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-subtle)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Doctor / Specialist:</span>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{report.doctorName}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Facility / Lab:</span>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{report.hospitalOrLab || 'Not specified'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Report Date:</span>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>
              {new Date(report.dateOfReport).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Uploaded On:</span>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>
              {new Date(report.createdAt || report.dateOfReport).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Extracted Structured Clinical Parameters */}
        {(report.extractedParameters || []).length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              Extracted Parameters & Reference Ranges
            </h4>
            <div className="cs-table-container">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Test / Parameter</th>
                    <th>Extracted Value</th>
                    <th>Reference Range</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.extractedParameters.map((param, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{param.key}</td>
                      <td><strong>{param.value}</strong> {param.unit}</td>
                      <td style={{ color: '#64748b' }}>{param.referenceRange || 'Standard range'}</td>
                      <td>
                        <span className={`badge ${
                          param.status === 'high' ? 'badge-danger' :
                          param.status === 'low' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {param.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Extracted Medications */}
        {(report.extractedMedications || []).length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Prescribed Medications Mentioned
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {report.extractedMedications.map((med, idx) => (
                <div key={idx} style={{
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem'
                }}>
                  <div style={{ fontWeight: 700, color: '#0f766e' }}>{med.name}</div>
                  <div style={{ fontSize: '0.825rem', color: '#334155' }}>Dosage: {med.dosage}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{med.instruction}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Extracted Document Text */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            OCR Extracted Document Content
          </h4>
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.825rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '180px',
            overflowY: 'auto',
            color: '#334155',
            lineHeight: 1.5
          }}>
            {report.ocrExtractedText || 'No raw text stored.'}
          </div>
        </div>

        {/* Safety Disclaimer Footer */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.775rem',
          color: '#64748b',
          marginBottom: '1.5rem'
        }}>
          <ShieldCheck size={16} color="var(--emerald)" />
          <span>Extracted information is assistive. Always refer to original physical or hospital PDF copy for definitive clinical decisions.</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download Formatted Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
