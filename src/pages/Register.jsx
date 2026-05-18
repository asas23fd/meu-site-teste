import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle, FiCheck } from 'react-icons/fi';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }
    if (password.length < 6) {
      setError('Password deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const result = register(username, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const passwordStrength = (pwd) => {
    if (pwd.length === 0) return { level: 0, label: '', color: '' };
    if (pwd.length < 4) return { level: 1, label: 'Fraca', color: 'var(--danger)' };
    if (pwd.length < 6) return { level: 2, label: 'Média', color: 'var(--warning)' };
    if (pwd.length < 10) return { level: 3, label: 'Forte', color: 'var(--success)' };
    return { level: 4, label: 'Muito Forte', color: '#22c55e' };
  };

  const strength = passwordStrength(password);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 60px',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '20%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)',
        filter: 'blur(100px)',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Logo size={40} />
            <span style={{
              fontSize: 24,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AuthShield</span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Criar Conta</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Comece a proteger as suas aplicações hoje</p>
        </div>

        {/* Form Card */}
        <div style={{
          padding: 32,
          borderRadius: 20,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
        }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--danger)', fontSize: 13, fontWeight: 500,
                marginBottom: 20,
              }}
            >
              <FiAlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="myusername" required
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'var(--bg-input)',
                    color: 'var(--text-primary)', fontSize: 14, transition: 'all 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="user@example.com" required
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'var(--bg-input)',
                    color: 'var(--text-primary)', fontSize: 14, transition: 'all 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '12px 42px 12px 42px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'var(--bg-input)',
                    color: 'var(--text-primary)', fontSize: 14, transition: 'all 0.2s',
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        height: 3, flex: 1, borderRadius: 2,
                        background: i <= strength.level ? strength.color : 'var(--border)',
                        transition: 'all 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strength.color, fontWeight: 500 }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Confirmar Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12,
                    border: `1px solid ${confirmPassword && confirmPassword === password ? 'var(--success)' : 'var(--border)'}`,
                    background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14, transition: 'all 0.2s',
                  }}
                />
                {confirmPassword && confirmPassword === password && (
                  <FiCheck size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }} />
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                background: loading ? 'var(--accent-hover)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <div style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                  borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                }} />
              ) : (
                <>Criar Conta <FiArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Plan info */}
          <div style={{
            marginTop: 20, padding: '12px 16px', borderRadius: 12,
            background: 'var(--accent-light)', border: '1px solid rgba(99, 102, 241, 0.15)',
            fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'center',
          }}>
            Plano <strong style={{ color: 'var(--accent)' }}>Free</strong> incluído • Upgrade a qualquer momento
          </div>
        </div>

        {/* Login link */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
}