import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  GitCompare,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const ComparisonPage = () => {
  const { reports } = useHealth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialReportA = queryParams.get('reportA') || '';

  const [selectedA, setSelectedA] = useState(initialReportA || (reports[1]?._id || reports[0]?._id || ''));
  const [selectedB, setSelectedB] = useState(reports[2]?._id || reports[0]?._id || '');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-run comparison if two reports are available
  useEffect(() => {
    if (selectedA && selectedB && selectedA !== selectedB) {
      runComparison(selectedA, selectedB);
    } else if (reports.length >= 2 && !selectedA && !selectedB) {
      setSelectedA(reports[0]._id);
      setSelectedB(reports[1]._id);
      runComparison(reports[0]._id, reports[1]._id);
    }
  }, [reports]);

  const runComparison = async (idA, idB) => {
    if (!idA || !idB) return;
    if (idA === idB) {
      setErrorMsg('Please select two distinct reports to compare.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.reports.compare(idA, idB);
      if (res.success && res.comparison) {
        setComparisonResult(res.comparison);
      } else {
        setErrorMsg(res.message || 'Comparison failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate record comparison.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareClick = () => {
    runComparison(selectedA, selectedB);
  };

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">“What Changed?” Record Comparison</h1>
            <span className="badge badge-warning">Extracted Text Only</span>
          </div>
          <p className="page-subtitle">
            Compare two medical records side-by-side to inspect changes in prescribed medications and clinical vitals.
          </p>
        </div>
      </div>

      {/* Strict Safety Notice */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: '#92400e'
      }}>
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Limited Scope Disclaimer:</strong> This comparison feature is strictly limited to verifiable, extracted text. It detects newly listed or omitted medicines and changed numeric values. It does <em>not</em> interpret clinical efficacy or replace a physician's holistic judgment.
        </div>
      </div>

      {/* Selection Control Card */}
      <div className="cs-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Select Two Records to Compare:
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '1rem', alignItems: 'center' }} className="compare-selectors">
          {/* Record A */}
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Previous / Baseline Record (A)</label>
            <select
              className="form-control"
              value={selectedA}
              onChange={(e) => setSelectedA(e.target.value)}
            >
              <option value="">Select Baseline Report...</option>
              {reports.map(r => (
                <option key={r._id} value={r._id}>
                  {new Date(r.dateOfReport).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {r.title} ({r.category})
                </option>
              ))}
            </select>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '1.5rem' }}>
            <ArrowRight size={24} color="var(--primary)" />
          </div>

          {/* Record B */}
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Updated / Recent Record (B)</label>
            <select
              className="form-control"
              value={selectedB}
              onChange={(e) => setSelectedB(e.target.value)}
            >
              <option value="">Select Follow-up Report...</option>
              {reports.map(r => (
                <option key={r._id} value={r._id}>
                  {new Date(r.dateOfReport).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {r.title} ({r.category})
                </option>
              ))}
            </select>
          </div>

          {/* Action button */}
          <div style={{ paddingTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCompareClick}
              disabled={loading || !selectedA || !selectedB || selectedA === selectedB}
            >
              <GitCompare size={16} />
              <span>{loading ? 'Comparing...' : 'Run Diff'}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ color: 'var(--rose)', fontSize: '0.875rem', marginTop: '0.75rem' }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {comparisonResult ? (
        <div>
          {/* Header Summary Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Record A (Baseline)</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{comparisonResult.olderRecord.title}</h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                📅 {new Date(comparisonResult.olderRecord.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {comparisonResult.olderRecord.doctor}
              </div>
            </div>

            <div style={{
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Record B (Updated)</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f766e' }}>{comparisonResult.newerRecord.title}</h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                📅 {new Date(comparisonResult.newerRecord.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {comparisonResult.newerRecord.doctor}
              </div>
            </div>
          </div>

          {/* Section 1: Medication Changes */}
          <div className="cs-card" style={{ marginBottom: '1.5rem' }}>
            <div className="cs-card-header">
              <div className="cs-card-title">
                <Sparkles size={20} color="var(--primary)" />
                <span>Prescription Delta (Medications)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Medications Added */}
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <PlusCircle size={18} />
                  <span>MEDICATIONS ADDED ({comparisonResult.medications.added.length})</span>
                </div>

                {comparisonResult.medications.added.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No new medications added.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {comparisonResult.medications.added.map((med, i) => (
                      <div key={i} style={{ background: '#ffffff', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontWeight: 700, color: '#15803d' }}>+ {med.name} ({med.dosage})</div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>{med.instruction}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications Removed / Discontinued */}
              <div style={{
                background: '#fff1f2',
                border: '1.5px solid #fda4af',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9f1239', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <MinusCircle size={18} />
                  <span>MEDICATIONS DISCONTINUED / REMOVED ({comparisonResult.medications.removed.length})</span>
                </div>

                {comparisonResult.medications.removed.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No medications removed.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {comparisonResult.medications.removed.map((med, i) => (
                      <div key={i} style={{ background: '#ffffff', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fecdd3' }}>
                        <div style={{ fontWeight: 700, color: '#be123c' }}>- {med.name} ({med.dosage})</div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>Not listed in follow-up prescription</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications Continued */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>CONTINUED MEDICATIONS ({comparisonResult.medications.continued.length})</span>
                </div>

                {comparisonResult.medications.continued.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>No medications continued across both.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {comparisonResult.medications.continued.map((med, i) => (
                      <div key={i} style={{ background: '#ffffff', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 700, color: '#0369a1' }}>✓ {med.name} ({med.dosage})</div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>{med.instruction}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Parameters Delta */}
          <div className="cs-card">
            <div className="cs-card-header">
              <div className="cs-card-title">
                <FileText size={20} color="var(--teal)" />
                <span>Changed Clinical Values (Vitals & Labs)</span>
              </div>
            </div>

            {comparisonResult.parameterChanges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                No conflicting numeric parameters detected between these two records.
              </div>
            ) : (
              <div className="cs-table-container">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Clinical Parameter</th>
                      <th>Previous Value (A)</th>
                      <th>Current Value (B)</th>
                      <th>Reference Range</th>
                      <th>Extracted Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonResult.parameterChanges.map((change, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{change.parameter}</td>
                        <td style={{ color: '#64748b' }}>{change.previousValue} {change.unit}</td>
                        <td>
                          <strong style={{ color: '#0f766e', fontSize: '1rem' }}>
                            {change.currentValue} {change.unit}
                          </strong>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{change.referenceRange || 'Standard'}</td>
                        <td>
                          <span className={`badge ${
                            change.changeType === 'modified' ? 'badge-info' : 'badge-other'
                          }`}>
                            {change.changeType === 'modified' ? 'Value Updated' : 'New Parameter Added'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="cs-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <GitCompare size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Select two records to generate a comparison</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Choose an older baseline test and a follow-up prescription to inspect what changed.
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .compare-selectors {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
