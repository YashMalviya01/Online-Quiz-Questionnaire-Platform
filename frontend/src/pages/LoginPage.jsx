import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice.js';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <section className="card" style={{ maxWidth: 420, margin: '3rem auto' }}>
      <h1>Welcome back</h1>
      <p style={{ color: '#64748b' }}>Log in to access your proctored exams.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {status === 'failed' && <p style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" className="primary-btn" style={{ width: '100%' }} disabled={status === 'loading'}>
          {status === 'loading' ? 'Verifying…' : 'Log in'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
};

export default LoginPage;
