import React from 'react';
import { ShieldAlert, HeartPulse } from 'lucide-react';

export const DisclaimerBanner = ({ compact = false }) => {
  if (compact) {
    return (
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: '#166534',
        marginBottom: '1rem'
      }}>
        <HeartPulse size={15} style={{ flexShrink: 0, color: '#16a34a' }} />
        <span><strong>CareSetu Safety:</strong> Assistive health journal. AI categorizes reports upon your confirmation; it never prescribes or diagnoses.</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, #f0fdfa 0%, #f0f9ff 100%)',
      border: '1px solid #ccfbf1',
      borderRadius: 'var(--radius-lg)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#ccfbf1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0d9488',
          flexShrink: 0
        }}>
          <ShieldAlert size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
            Medical & AI Safety Commitment
          </div>
          <div style={{ fontSize: '0.825rem', color: '#475569' }}>
            CareSetu organizes your health journey. AI features are purely assistive — category suggestions always require your explicit confirmation. CareSetu never provides automatic diagnoses or alters doctor prescriptions.
          </div>
        </div>
      </div>
      <span className="badge badge-info" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
        Strict Clinical Safety
      </span>
    </div>
  );
};
