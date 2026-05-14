import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <section className="section auth-section">
      <div className="container auth-card">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Full name</label>
            <input 
              type="text" 
              id="name" 
              className="input" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className="form-row">
            <label htmlFor="mobile">Mobile number</label>
            <input 
              type="tel" 
              id="mobile" 
              className="input" 
              placeholder="9999999999" 
              value={formData.phoneNumber}
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              required 
            />
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="input" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div className="form-row">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input 
              type="password" 
              id="confirm_password" 
              className="input" 
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : 'Create account'}
          </button>
        </form>
        <p className="auth-alt" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
