import React, { useState } from 'react';
import { registerApplicant } from '../services/api';

export default function ApplicantRegister({ onBackToLogin }) {
    const [form, setForm] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirm_password) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await registerApplicant({
                username: form.username,
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                phone_number: form.phone_number,
                password: form.password,
            });
            setSuccess('Account created successfully! You can now login.');
            setTimeout(() => onBackToLogin(), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>MMCSS</h1>
                    <p style={styles.subtitle}>Create Applicant Account</p>
                    <p style={styles.university}>Mobile Money Credit Scoring System</p>
                </div>

                {success ? (
                    <div style={styles.successBox}>
                        <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>✅</p>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#2e7d32', margin: '0 0 8px 0' }}>
                            {success}
                        </p>
                        <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>
                            Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.grid}>
                            <div style={styles.field}>
                                <label style={styles.label}>First Name *</label>
                                <input style={styles.input} name="first_name"
                                    value={form.first_name} onChange={handleChange}
                                    placeholder="First name" required />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Last Name *</label>
                                <input style={styles.input} name="last_name"
                                    value={form.last_name} onChange={handleChange}
                                    placeholder="Last name" required />
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Username *</label>
                            <input style={styles.input} name="username"
                                value={form.username} onChange={handleChange}
                                placeholder="Choose a username" required />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Email Address *</label>
                            <input style={styles.input} type="email" name="email"
                                value={form.email} onChange={handleChange}
                                placeholder="your@email.com" required />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Phone Number *</label>
                            <input style={styles.input} name="phone_number"
                                value={form.phone_number} onChange={handleChange}
                                placeholder="e.g. 0788000000" required />
                        </div>

                        <div style={styles.grid}>
                            <div style={styles.field}>
                                <label style={styles.label}>Password *</label>
                                <input style={styles.input} type="password" name="password"
                                    value={form.password} onChange={handleChange}
                                    placeholder="Min 8 characters" required />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Confirm Password *</label>
                                <input style={styles.input} type="password" name="confirm_password"
                                    value={form.confirm_password} onChange={handleChange}
                                    placeholder="Repeat password" required />
                            </div>
                        </div>

                        <div style={styles.infoBox}>
                            <p style={styles.infoText}>
                                📋 After registration, a loan officer will analyse your mobile money CSV data and provide your credit score and recommendation.
                            </p>
                        </div>

                        <button style={loading ? styles.buttonDisabled : styles.button}
                            type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <button style={styles.backBtn} type="button" onClick={onBackToLogin}>
                            ← Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    card: { background: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    header: { textAlign: 'center', marginBottom: '28px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#1a237e', margin: '0 0 8px 0' },
    subtitle: { fontSize: '16px', fontWeight: '600', color: '#333', margin: '0 0 4px 0' },
    university: { fontSize: '12px', color: '#888', margin: '0' },
    successBox: { textAlign: 'center', padding: '32px 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#333' },
    input: { padding: '11px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
    infoBox: { background: '#e8eaf6', borderRadius: '8px', padding: '12px' },
    infoText: { fontSize: '12px', color: '#3949ab', margin: 0, lineHeight: '1.6' },
    button: { padding: '14px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    buttonDisabled: { padding: '14px', background: '#9e9e9e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'not-allowed' },
    backBtn: { padding: '12px', background: 'none', color: '#1a237e', border: '1px solid #1a237e', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center' },
};