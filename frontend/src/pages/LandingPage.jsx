import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import {
  Activity,
  Upload,
  LayoutDashboard,
  ShieldCheck,
  Clock,
  Pill,
  Users,
  GitCompare,
  BookOpen,
  Stethoscope,
  CheckCircle2,
  Lock,
  HeartHandshake,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const { setIsUploadModalOpen } = useHealth();
  const navigate = useNavigate();

  const handleDemoPatient = async () => {
    await demoLogin('patient');
    navigate('/dashboard');
  };

  const handleDemoDoctor = async () => {
    await demoLogin('doctor');
    navigate('/dashboard');
  };

  const handleUploadClick = () => {
    if (isAuthenticated) {
      setIsUploadModalOpen(true);
    } else {
      navigate('/login?redirect=upload');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at top right, #e0f2fe 0%, #f0fdfa 40%, #f8fafc 100%)',
        padding: '4.5rem 1.25rem 3.5rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          {/* Tagline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid #bae6fd',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--primary)'
          }}>
            <Sparkles size={16} />
            <span>“Aapki Sehat, Aapki Kahani.”</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#0f172a',
            marginBottom: '1.25rem'
          }}>
            One Place for Your Entire{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Health Journey.
            </span>
          </h1>

          {/* Problem Statement */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '750px',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            Medical reports get scattered across WhatsApp, paper files, and email inboxes. 
            <strong> CareSetu</strong> brings them into a chronological, understandable timeline — empowering you and your consulting doctors with verified health context.
          </p>

          {/* Hero CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleUploadClick}
              style={{ minWidth: '180px' }}
            >
              <Upload size={18} />
              <span>Upload Report</span>
            </button>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: '180px' }}
            >
              <LayoutDashboard size={18} />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* 1-Click Demo Showcase for Evaluators */}
          <div style={{
            display: 'inline-block',
            background: '#ffffff',
            border: '1.5px solid #bae6fd',
            borderRadius: 'var(--radius-xl)',
            padding: '1rem 1.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
              ⚡ INSTANT HACKATHON EVALUATOR ACCESS (NO TYPING REQUIRED):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleDemoPatient}
              >
                👤 Try Demo Patient (Rahul Sharma)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDemoDoctor}
              >
                🩺 Try Demo Doctor (Dr. Gupta)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & AI Safety Banner */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--emerald)" />
            <span>AI Assistive Only — No Auto Diagnosis</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--primary)" />
            <span>End-to-End Privacy & Isolated Child Records</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartHandshake size={18} color="var(--teal)" />
            <span>Explicit Consent-Based Doctor Sharing</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1.25rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Core Capabilities</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            Designed for Real Patient Needs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Every feature is crafted to solve genuine healthcare challenges without unnecessary medical jargon.
          </p>
        </div>

        <div className="grid-cols-3">
          {/* Feature 1 */}
          <div className="cs-card">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#e0f2fe',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              AI Category Suggestion with Confirmation
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              OCR scans your document and AI suggests categories (Cardiology, Lab, Radiology, etc.) with confidence scores. Only after you confirm is it saved.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="cs-card">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ccfbf1',
              color: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Chronological Health Timeline
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              View doctor consultations, lab reports, and medicine changes in one visual storyline. Filter effortlessly by doctor specialty or date.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="cs-card">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: 'var(--amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <GitCompare size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              “What Changed?” Comparison
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Compare two reports to see medications added, medications discontinued, and key changes like blood pressure or cholesterol levels.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="cs-card">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ffe4e6',
              color: 'var(--rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Pill size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Duration-Based Medicine Tracker
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              If prescribed a 15-day course, reminders automatically conclude after 15 days. Missed doses are logged without altering prescriptions.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="cs-card">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f3e8ff',
              color: '#7e22ce',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Family Zone & Child Vaccines
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Keep your children's pediatric milestones, immunizations (BCG, Polio, DTP), and reports completely isolated from adult records.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="cs-card">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#d1fae5',
              color: 'var(--emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Stethoscope size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              1-Click Doctor Brief with Consent
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Generate a 1-page consultation brief. Share via a secure 24-hour access code that you can revoke with a single tap.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Simple Workflow</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              How CareSetu Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              From physical prescription to a structured health timeline in four steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1, marginBottom: '0.5rem' }}>01</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Upload Document</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upload your PDF, prescription photo, or lab result. No manual data entry required.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1, marginBottom: '0.5rem' }}>02</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>AI Suggests & You Confirm</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>OCR extracts parameters while AI suggests the category. You review and confirm.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1, marginBottom: '0.5rem' }}>03</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Chronological Journey</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your timeline automatically updates with doctor visits, medicines, and milestones.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1, marginBottom: '0.5rem' }}>04</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Consult with Confidence</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hand your consulting doctor a 60-second brief with verified history and active meds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section style={{ padding: '4rem 1.25rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ maxWidth: '650px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(13, 148, 136, 0.25)',
              border: '1px solid #0d9488',
              color: '#2dd4bf',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={16} /> Strict Privacy Architecture
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Your Medical Records Are Your Private Property
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Unlike commercial portals that monetize patient profiles, CareSetu enforces total data sovereignty:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Zero publicly accessible document URLs</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Doctors can only access records with your explicit consent and temporary token</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>Children and dependent records are isolated under authorized guardianship</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#2dd4bf" />
                <span>1-Click complete data deletion anytime you decide</span>
              </li>
            </ul>

            <Link to="/signup" className="btn btn-primary btn-lg">
              <span>Create Your Free Secure Vault</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
