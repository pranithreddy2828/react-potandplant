import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Calendar, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>Please login to view profile.</div>;

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="profile-card" style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--green-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--green)' }}>
              <User size={40} />
            </div>
            <h1 style={{ marginBottom: '0.25rem' }}>{user.name}</h1>
            <p style={{ color: '#666' }}>Pot & Plants Member</p>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8faf9', borderRadius: '16px' }}>
              <Phone size={20} color="#666" />
              <div>
                <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>Phone Number</p>
                <p style={{ fontWeight: '600' }}>{user.phoneNumber}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8faf9', borderRadius: '16px' }}>
              <Calendar size={20} color="#666" />
              <div>
                <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>Member Since</p>
                <p style={{ fontWeight: '600' }}>{new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Edit2 size={18} /> Edit Profile Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
