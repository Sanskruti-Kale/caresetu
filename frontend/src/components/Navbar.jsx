import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import {
  Activity,
  FileText,
  Clock,
  Pill,
  Users,
  BookOpen,
  Stethoscope,
  User,
  LogOut,
  Upload,
  Menu,
  X,
  GitCompare,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { activeDependentId, setActiveDependentId, dependents, setIsUploadModalOpen } = useHealth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [depDropdownOpen, setDepDropdownOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Activity },
    { to: '/records', label: 'Health Records', icon: FileText },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/what-changed', label: 'What Changed?', icon: GitCompare },
    { to: '/medicines', label: 'Medicines', icon: Pill },
    { to: '/family-zone', label: 'Family Zone', icon: Users },
    { to: '/report-guide', label: 'Report Guide', icon: BookOpen },
    { to: '/doctor-brief', label: 'Doctor Brief', icon: Stethoscope }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeDependentLabel = activeDependentId === 'self'
    ? (user ? `${user.name.split(' ')[0]} (Self)` : 'Self')
    : (dependents.find(d => d._id === activeDependentId)?.name || 'Dependent');

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand / Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              CareSetu
            </div>
            <div style={{ fontSize: '0.675rem', fontWeight: 600, color: '#64748b' }}>
              Aapki Sehat, Aapki Kahani.
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.25rem',
            overflowX: 'auto',
            padding: '0 0.5rem'
          }} className="desktop-nav">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Section Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {isAuthenticated ? (
            <>
              {/* Dependent Switcher */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setDepDropdownOpen(!depDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.75rem',
                    background: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  <Users size={14} color="var(--primary)" />
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeDependentLabel}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {depDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    zIndex: 101,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', background: '#f8fafc' }}>
                      ACTIVE HEALTH PROFILE
                    </div>
                    <button
                      onClick={() => { setActiveDependentId('self'); setDepDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        textAlign: 'left',
                        background: activeDependentId === 'self' ? '#e0f2fe' : '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: activeDependentId === 'self' ? 700 : 500,
                        color: activeDependentId === 'self' ? '#0369a1' : '#1e293b'
                      }}
                    >
                      👤 {user?.name || 'Self'} (Self)
                    </button>
                    {dependents.map(dep => (
                      <button
                        key={dep._id}
                        onClick={() => { setActiveDependentId(dep._id); setDepDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.85rem',
                          textAlign: 'left',
                          background: activeDependentId === dep._id ? '#e0f2fe' : '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: activeDependentId === dep._id ? 700 : 500,
                          color: activeDependentId === dep._id ? '#0369a1' : '#1e293b'
                        }}
                      >
                        👶 {dep.name} ({dep.relationship})
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-light)' }}>
                      <Link
                        to="/family-zone"
                        onClick={() => setDepDropdownOpen(false)}
                        style={{
                          display: 'block',
                          padding: '0.5rem 0.85rem',
                          fontSize: '0.775rem',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          textAlign: 'center'
                        }}
                      >
                        + Manage Family Zone
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Report Quick Action Button */}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload size={14} />
                <span className="hidden-mobile">Upload Report</span>
              </button>

              {/* Profile Link */}
              <Link
                to="/profile"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1.5px solid #bae6fd'
                }}
                title="Your Health Profile & Settings"
              >
                <User size={17} />
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--rose)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)'
                }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          {isAuthenticated && (
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-main)',
                padding: '0.25rem'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isAuthenticated && mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .hidden-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
};
