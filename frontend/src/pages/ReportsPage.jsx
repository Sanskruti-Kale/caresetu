import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ReportCard } from '../components/ReportCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Sparkles,
  GitCompare,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const ReportsPage = () => {
  const { reports, setIsUploadModalOpen, activeDependentId, activeDependent } = useHealth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reports
  const filteredReports = reports.filter(rep => {
    const matchesCategory = selectedCategory === 'All' || rep.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      rep.title?.toLowerCase().includes(q) ||
      rep.doctorName?.toLowerCase().includes(q) ||
      rep.hospitalOrLab?.toLowerCase().includes(q) ||
      (rep.ocrExtractedText && rep.ocrExtractedText.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="content-wrapper">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">Medical Reports Archive</h1>
            {activeDependent && (
              <span className="badge badge-info">
                👶 {activeDependent.name} ({activeDependent.relationship})
              </span>
            )}
          </div>
          <p className="page-subtitle">
            All your uploaded prescriptions, pathology tests, and imaging records in one structured repository.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/what-changed" className="btn btn-secondary">
            <GitCompare size={16} />
            <span>Compare in “What Changed?”</span>
          </Link>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload size={16} />
            <span>Upload & AI Categorize</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="cs-card" style={{ padding: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search reports by doctor name, hospital, test title, or clinical parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {CATEGORIES.map(cat => {
              const count = cat === 'All'
                ? reports.length
                : reports.filter(r => r.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border-light)',
                    backgroundColor: isActive ? 'var(--primary-light)' : '#ffffff',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{cat}</span>
                  <span style={{
                    fontSize: '0.725rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'var(--primary)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="cs-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Medical Reports Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            {searchTerm || selectedCategory !== 'All'
              ? 'No reports match your current filter or search criteria. Try selecting "All" or clearing the search.'
              : 'You have not uploaded any medical records yet. Upload your first PDF or image to get started!'}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload size={16} />
            <span>Upload Medical Report</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredReports.map(report => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};
