import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { api } from '../services/api';
import {
  Upload,
  X,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  Building
} from 'lucide-react';

const CATEGORIES = [
  'Cardiology',
  'Laboratory',
  'Radiology',
  'Orthopedics',
  'General Medicine',
  'Dental',
  'Other'
];

export const UploadModal = ({ isOpen, onClose }) => {
  const { refreshData, activeDependentId, dependents } = useHealth();

  // Wizard state: 1 = select file, 2 = analyzing (OCR/AI), 3 = review & confirm category
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalOrLab, setHospitalOrLab] = useState('');
  const [dateOfReport, setDateOfReport] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [targetDependentId, setTargetDependentId] = useState(activeDependentId === 'self' ? '' : activeDependentId);

  // Analysis results from server
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confirmedCategory, setConfirmedCategory] = useState('General Medicine');

  // Loading & error handling
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setTitle('');
    setDoctorName('');
    setHospitalOrLab('');
    setDateOfReport(new Date().toISOString().split('T')[0]);
    setNotes('');
    setAnalysisResult(null);
    setConfirmedCategory('General Medicine');
    setIsProcessing(false);
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  // Step 1: Submit file for OCR + AI Category Analysis
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a PDF, JPG, or PNG report file to analyze.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    setStep(2);

    try {
      const formData = new FormData();
      formData.append('reportFile', selectedFile);
      formData.append('title', title || selectedFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('notes', notes);

      const res = await api.reports.analyze(formData);

      if (res.success && res.analysis) {
        setAnalysisResult(res.analysis);
        setConfirmedCategory(res.analysis.aiSuggestedCategory || 'General Medicine');
        if (!title) {
          setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
        }
        setStep(3); // Move to user review & confirmation
      } else {
        throw new Error(res.message || 'AI / OCR analysis failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error uploading report. Please try again.');
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Demo Samples for instant Viva testing
  const handleSelectSample = (sampleType) => {
    let dummyFile;
    if (sampleType === 'ecg') {
      dummyFile = new File(['Dummy ECG report content'], 'ECG_Cardiology_Trace_2026.pdf', { type: 'application/pdf' });
      setTitle('12-Lead Resting ECG Report');
      setDoctorName('Dr. Ananya Gupta');
      setHospitalOrLab('Apollo Heart Institute');
    } else if (sampleType === 'cbc') {
      dummyFile = new File(['Dummy CBC content'], 'CBC_Lipid_Blood_Test.pdf', { type: 'application/pdf' });
      setTitle('CBC & Lipid Profile Test');
      setDoctorName('Dr. Rajesh Nair');
      setHospitalOrLab('Dr. Lal PathLabs');
    } else {
      dummyFile = new File(['Dummy XRay content'], 'Chest_XRay_Radiology.png', { type: 'image/png' });
      setTitle('Digital Chest X-Ray Scan');
      setDoctorName('Dr. K. Sharma');
      setHospitalOrLab('Max Diagnostic Center');
    }
    setSelectedFile(dummyFile);
  };

  // Step 2: User Confirms or Changes Category & Permanently Saves
  const handleConfirmAndSave = async () => {
    if (!title) {
      setErrorMsg('Please enter a title for the report.');
      return;
    }
    if (!confirmedCategory) {
      setErrorMsg('Please confirm or select a category.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const payload = {
        title,
        confirmedCategory, // The category explicitly confirmed or altered by user
        doctorName: doctorName || 'Attending Physician',
        hospitalOrLab: hospitalOrLab || '',
        dateOfReport,
        fileUrl: analysisResult?.fileUrl || '/sample-reports/cbc_lipid_report.pdf',
        fileName: analysisResult?.fileName || selectedFile?.name || 'Medical_Report.pdf',
        fileType: analysisResult?.fileType || 'pdf',
        fileSize: analysisResult?.fileSize || 300000,
        extractedText: analysisResult?.extractedText || '',
        aiSuggestedCategory: analysisResult?.aiSuggestedCategory || confirmedCategory,
        aiConfidence: analysisResult?.aiConfidence || 0.90,
        aiExtractedKeywords: analysisResult?.aiExtractedKeywords || [],
        extractedParameters: analysisResult?.extractedParameters || [],
        extractedMedications: analysisResult?.extractedMedications || [],
        notes,
        dependentId: targetDependentId || null
      };

      const res = await api.reports.confirmSave(payload);

      if (res.success) {
        setSuccessMsg(`Report successfully saved under ${confirmedCategory}! Updating your health journey...`);
        await refreshData();
        setTimeout(() => {
          resetModal();
        }, 1200);
      } else {
        throw new Error(res.message || 'Failed to save report.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save report.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={resetModal}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Upload Medical Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Step {step === 1 ? '1: Upload & Extract' : step === 2 ? 'Analyzing...' : '2: Confirm AI Categorization'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={resetModal}>
            <X size={20} />
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Upload File & Details */}
        {step === 1 && (
          <form onSubmit={handleAnalyze}>
            {/* Quick Demo Test Buttons */}
            <div style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                ⚡ QUICK DEMO SELECTOR (FOR INSTANT HACKATHON TESTING):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleSelectSample('cbc')}
                  className="btn btn-secondary btn-sm"
                >
                  🧪 Lab CBC & Lipid PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('ecg')}
                  className="btn btn-secondary btn-sm"
                >
                  ❤️ Cardiology ECG PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('xray')}
                  className="btn btn-secondary btn-sm"
                >
                  🩻 Chest X-Ray Scan
                </button>
              </div>
            </div>

            {/* Drop Zone */}
            <div style={{
              border: '2px dashed var(--primary)',
              backgroundColor: '#f0f9ff',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              position: 'relative'
            }}>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    if (!title) {
                      setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                    }
                  }
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />
              <FileText size={40} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                {selectedFile ? selectedFile.name : 'Click or Drag & Drop Medical Report Here'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Supported Formats: PDF, JPG, PNG (Max 15 MB)
              </div>
              {selectedFile && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.75rem',
                  padding: '0.25rem 0.65rem',
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={14} /> File selected ({Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Report Title / Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Annual Blood Test, Echo Report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Report</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateOfReport}
                  onChange={(e) => setDateOfReport(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Doctor / Specialist</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Ananya Gupta (Cardiologist)"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Diagnostic Lab</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Apollo Hospital, Dr Lal Pathlabs"
                  value={hospitalOrLab}
                  onChange={(e) => setHospitalOrLab(e.target.value)}
                />
              </div>
            </div>

            {/* Target Person: Self or Child/Dependent */}
            <div className="form-group">
              <label className="form-label">Whose Health Record is this?</label>
              <select
                className="form-control"
                value={targetDependentId}
                onChange={(e) => setTargetDependentId(e.target.value)}
              >
                <option value="">👤 Myself (Personal Profile)</option>
                {dependents.map(d => (
                  <option key={d._id} value={d._id}>
                    👶 {d.name} ({d.relationship})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={resetModal}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedFile || isProcessing}
              >
                <Sparkles size={16} />
                <span>Run OCR & AI Categorization</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Processing Animation */}
        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'spin 2s linear infinite'
            }}>
              <Cpu size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Extracting Text & Analyzing Report...
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto' }}>
              CareSetu is parsing document text via OCR and scanning for diagnostic markers. AI category suggestions will be presented for your confirmation.
            </p>
            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {/* Step 3: Review AI Suggestion & Confirm / Change Category */}
        {step === 3 && analysisResult && (
          <div>
            {/* AI Suggestion Card */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #f0f9ff 100%)',
              border: '1.5px solid #0d9488',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="#0d9488" />
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                    AI-Assisted Category Suggestion
                  </span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                  {Math.round(analysisResult.aiConfidence * 100)}% Confidence Match
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.75rem' }}>
                CareSetu analyzed <strong>{analysisResult.fileName}</strong> and suggests:
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #99f6e4',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>SUGGESTED CATEGORY</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f766e' }}>
                    {analysisResult.aiSuggestedCategory}
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '280px', justifyContent: 'flex-end' }}>
                  {(analysisResult.aiExtractedKeywords || []).map((kw, i) => (
                    <span key={i} style={{
                      background: '#f1f5f9',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: '#475569'
                    }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strict Safety Protocol Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#065f46'
              }}>
                <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Human-in-the-Loop Protocol:</strong> AI never decides your medical classification automatically. You can confirm this category or change it below before saving.
                </span>
              </div>
            </div>

            {/* User Confirmation & Choice Section */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Confirm or Change Category:
              </label>
              <select
                className="form-control"
                value={confirmedCategory}
                onChange={(e) => setConfirmedCategory(e.target.value)}
                style={{ fontSize: '1rem', fontWeight: 600, padding: '0.75rem' }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} {cat === analysisResult.aiSuggestedCategory ? '(AI Recommended)' : ''}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Only after you click "Confirm & Save" will this report be securely stored in your health records.
              </p>
            </div>

            {/* Extracted Parameters Preview */}
            {(analysisResult.extractedParameters || []).length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#475569' }}>
                  DETECTED CLINICAL PARAMETERS (FOR TIMELINE & COMPARISON):
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysisResult.extractedParameters.map((p, idx) => (
                    <div key={idx} style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.825rem'
                    }}>
                      <span style={{ color: '#64748b' }}>{p.key}:</span>{' '}
                      <strong>{p.value} {p.unit}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                Back / Edit File
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmAndSave}
                disabled={isProcessing}
              >
                <CheckCircle size={16} />
                <span>Confirm Category & Save Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
