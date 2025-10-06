import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import Logo from '../pentacore_solution_logo/Logo.png';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header style={{ padding: '1rem 1.5rem', background: '#ff9248', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            fontWeight: 700, 
            fontSize: '1.2rem', 
            color: '#fff', 
            textDecoration: 'none' 
          }}
        >
          <img 
            src={Logo} 
            alt="Pentacore Solutions Logo" 
            style={{
              height: '2.5rem',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <span>Pentacore Solutions</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#3b82f6',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                Dashboard
              </Link>
              {user.role === 'student' && (
                <Link
                  to="/face-enrollment"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 500,
                    padding: '0.5rem 1.25rem',
                    borderRadius: '8px',
                    background: user.isFaceVerified ? '#10b981' : '#f59e0b',
                    transition: 'background 0.2s',
                    display: 'inline-block',
                    border: 'none',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => e.target.style.background = user.isFaceVerified ? '#059669' : '#d97706'}
                  onMouseLeave={(e) => e.target.style.background = user.isFaceVerified ? '#10b981' : '#f59e0b'}
                >
                  {user.isFaceVerified ? '✓ Verified' : 'Verify Face'}
                </Link>
              )}
              <Link 
                to="/about" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#8b5cf6',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
                onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
              >
                About
              </Link>
              <button 
                type="button" 
                onClick={handleLogout}
                style={{ 
                  color: '#fff', 
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#ef4444',
                  transition: 'background 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/about" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#8b5cf6',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#7c3aed'}
                onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
              >
                About
              </Link>
              <Link 
                to="/login" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#3b82f6',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                Login
              </Link>
              <Link 
                to="/register"
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none', 
                  fontWeight: 500,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  background: '#10b981',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                  border: 'none',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={(e) => e.target.style.background = '#059669'}
                onMouseLeave={(e) => e.target.style.background = '#10b981'}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
