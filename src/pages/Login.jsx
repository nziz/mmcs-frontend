// src/components/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginUser(credentials.username, credentials.password);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            if (onLoginSuccess) onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>MMCSS</h1>
                    <p style={styles.logoSub}>Mobile Money Credit Scoring System</p>
                    <h2 style={styles.title}>Welcome Back</h2>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input style={styles.input} name="username" value={credentials.username} onChange={handleChange} required />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input style={styles.input} type="password" name="password" value={credentials.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <button onClick={onNavigateToRegister} style={{ ...styles.linkButton, marginTop: '15px' }}>
                    Don't have an account? Create one here
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
    card: { border: '1px solid #ddd', padding: '30px', borderRadius: '8px', maxWidth: '450px', width: '100%', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    header: { textAlign: 'center', marginBottom: '25px' },
    logo: { margin: 0, fontSize: '28px', color: '#007bff' },
    logoSub: { color: '#666', fontSize: '13px', margin: '5px 0' },
    title: { fontSize: '20px', color: '#333', margin: '15px 0 0 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontWeight: 'bold', fontSize: '13px', color: '#555' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
    button: { padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    linkButton: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', width: '100%' },
    error: { color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', border: '1px solid #f5c6cb' }
};
