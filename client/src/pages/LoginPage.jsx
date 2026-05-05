import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveSession } from '../services/api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = await login(email.trim(), password);
      saveSession(auth);
      setEmail('');
      setPassword('');
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Login</h2>
      <p className="hint">
        Seeded users: <strong>admin@courseforge.com</strong>, <strong>mona@courseforge.com</strong>, <strong>omar@student.com</strong>
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </section>
  );
}
