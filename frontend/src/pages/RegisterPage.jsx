import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice.js';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'student' });

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <section className="card" style={{ maxWidth: 480, margin: '3rem auto' }}>
      <h1>Create your account</h1>
      <p style={{ color: '#64748b' }}>Join the Smart Quiz with Anti-Cheat Features platform.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
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
          minLength={6}
        />
        <label htmlFor="role">Role</label>
        <select id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="admin">Administrator</option>
        </select>
        {status === 'failed' && <p style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" className="primary-btn" style={{ width: '100%' }} disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
