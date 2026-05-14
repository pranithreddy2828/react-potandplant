import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOtpLogin) {
      toast.info('OTP login is coming soon! Please use password login.');
      return;
    }
    setLoading(true);
    const result = await login(phoneNumber, password);
    setLoading(false);
    if (result.success) {
      toast.success('Login successful!');
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.msg);
    }
  };

  return (
    <section className="section auth-section">
      <div className="container auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="mobile">Mobile number</label>
            <input 
              type="tel" 
              id="mobile" 
              className="input" 
              placeholder="9999999999" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-row">
            <label htmlFor={isOtpLogin ? "otp" : "password"}>{isOtpLogin ? "One-Time Password (OTP)" : "Password"}</label>
            <input 
              type={isOtpLogin ? "text" : "password"} 
              id={isOtpLogin ? "otp" : "password"} 
              className="input" 
              placeholder={isOtpLogin ? "Enter 6-digit OTP" : "Enter password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setIsOtpLogin(!isOtpLogin)} 
              className="btn-otp-toggle"
              style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
            >
              {isOtpLogin ? "Login with Password" : "Login with OTP"}
            </button>
          </div>

          {!isOtpLogin && (
            <div className="form-row form-row-inline">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="remember" /> Remember me
              </label>
            </div>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Logging in...' : (isOtpLogin ? "Verify & Login" : "Login")}
          </button>
        </form>
        <p className="auth-alt" style={{ marginTop: '1rem', textAlign: 'center' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
