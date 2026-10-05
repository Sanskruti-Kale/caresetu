import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      padding: '3rem 1.25rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Activity size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                CareSetu
              </span>
            </div>
            <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              “Aapki Sehat, Aapki Kahani.”
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A personal health-record management platform that helps you organize scattered medical reports into a chronological, understandable health journey.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>Health Dashboard</Link></li>
              <li><Link to="/records" style={{ color: 'var(--text-secondary)' }}>Medical Reports Archive</Link></li>
              <li><Link to="/timeline" style={{ color: 'var(--text-secondary)' }}>Health Journey Timeline</Link></li>
              <li><Link to="/what-changed" style={{ color: 'var(--text-secondary)' }}>“What Changed?” Comparison</Link></li>
              <li><Link to="/medicines" style={{ color: 'var(--text-secondary)' }}>Medicine & Reminder Tracker</Link></li>
            </ul>
          </div>

          {/* Col 3: Care Modules */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Specialized Zones
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/family-zone" style={{ color: 'var(--text-secondary)' }}>Family Zone & Child Immunization</Link></li>
              <li><Link to="/report-guide" style={{ color: 'var(--text-secondary)' }}>Educational Report Guide</Link></li>
              <li><Link to="/doctor-brief" style={{ color: 'var(--text-secondary)' }}>Doctor Consultation Brief</Link></li>
              <li><Link to="/profile" style={{ color: 'var(--text-secondary)' }}>Privacy & Data Rights</Link></li>
            </ul>
          </div>

          {/* Col 4: Safety & Privacy */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--emerald)" />
              Privacy & AI Safety
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Your medical data belongs only to you. AI categorizations are assistive recommendations that require user confirmation.
            </p>
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              Zero public document URLs. Consent-based temporary doctor tokens.
            </div>
          </div>
        </div>

        {/* Emergency Medical Advisory */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: '#92400e',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Emergency Medical Advisory:</strong> CareSetu is not an emergency response provider and does not diagnose illnesses. If you or a family member are experiencing a medical emergency, immediately contact your nearest hospital or emergency services (National Emergency: 112 / Ambulance: 102).
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} CareSetu. Built with clean React & Node.js for personal health record management.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Crafted with</span>
            <Heart size={13} color="#e11d48" fill="#e11d48" />
            <span>for seamless patient health journeys</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
