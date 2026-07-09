// --- FRAGMENT 1: START OF FILE ---
import React, { useState, useEffect } from 'react';
import { fetchInstitutions, registerApplicant, verifyApplicantOtp, resendOtpToken } from './api';

export default function ApplicantRegister({ onBackToLogin }) {
    const [step, setStep] = useState('register');
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');

    const [form, setForm] = useState({
        username: '', first_name: '', last_name: '', email: '', phone_number: '',
        password: '', confirm_password: '', national_id: '', gender: '',
        district: '', mobile_operator: 'mtn', institution_id: '',
    });

    useEffect(() => {
        fetchInstitutions()
            .then(data => setInstitutions(data))
            .catch(() => setError('Failed to load bank/institution lists.'));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirm_password) return setError('Passwords do not match.');
        if (form.password.length < 8) return setError('Password must be at least 8 characters.');
        if (!/^\d{16}$/.test(form.national_id.trim())) return setError('National ID must be exactly 16 digits.');

        setLoading(true);
        try {
            const data = await registerApplicant(form);
            setUsername(form.username);
            setSuccess(data.message || 'Verification code sent!');
            setStep('verify');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };
// --- FRAGMENT 2: MIDDLE LOGIC & HTML ---
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const data = await verifyApplicantOtp(username, otp);
            setSuccess('Account verified successfully!');
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setTimeout(() => { if (onBackToLogin) onBackToLogin(); }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        setResendLoading(true);
        try {
            const data = await resendOtpToken(username);
            setSuccess(data.message || 'A new code has been sent.');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend code.');
        } finally {
            setResendLoading(false);
        }
    };

    const rwandaDistricts = [
        'Bugesera','Burera','Gakenke','Gasabo','Gatsibo','Gicumbi','Gisagara','Huye','Kamonyi','Karongi',
        'Kayonza','Kicukiro','Kirehe','Muhanga','Musanze','Ngoma','Ngororero','Nyabihu','Nyagatare','Nyamagabe',
        'Nyamasheke','Nyanza','Nyarugenge','Nyaruguru','Rubavu','Ruhango','Rulindo','Rusizi','Rutsiro','Rwamagana'
    ];

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>MMCSS</h1>
                    <p style={styles.logoSub}>Mobile Money Credit Scoring System</p>
                    <h2 style={styles.title}>{step === 'register' ? 'Create Your Account' : 'Verify Identity'}</h2>
                </div>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                {step === 'register' ? (
                    <form onSubmit={handleRegister} style={styles.form}>
                        <div style={styles.grid}>
                            <div style={styles.field}><label style={styles.label}>Username *</label><input style={styles.input} name="username" value={form.username} onChange={handleChange} required /></div>
                            <div style={styles.field}><label style={styles.label}>Email *</label><input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required /></div>
                            <div style={styles.field}><label style={styles.label}>First Name *</label><input style={styles.input} name="first_name" value={form.first_name} onChange={handleChange} required /></div>
                            <div style={styles.field}><label style={styles.label}>Last Name *</label><input style={styles.input} name="last_name" value={form.last_name} onChange={handleChange} required /></div>
                            <div style={styles.field}><label style={styles.label}>Phone *</label><input style={styles.input} name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="07XXXXXXXX" required /></div>
                            <div style={styles.field}><label style={styles.label}>National ID *</label><input style={styles.input} name="national_id" value={form.national_id} onChange={handleChange} placeholder="16 Digits" required /></div>
                            <div style={styles.field}>
                                <label style={styles.label}>Gender *</label>
                                <select style={styles.input} name="gender" value={form.gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option>
                                </select>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>District *</label>
                                <select style={styles.input} name="district" value={form.district} onChange={handleChange} required>
                                    <option value="">Select District</option>
                                    {rwandaDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Operator *</label>
                                <select style={styles.input} name="mobile_operator" value={form.mobile_operator} onChange={handleChange} required>
                                    <option value="mtn">MTN</option><option value="airtel">Airtel</option>
                                </select>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Institution *</label>
                                <select style={styles.input} name="institution_id" value={form.institution_id} onChange={handleChange} required>
                                    <option value="">Select Institution</option>
                                    {institutions.map(inst => (
                                        <option key={inst.id || inst.institution_id} value={inst.id || inst.institution_id}>
                                            {inst.name || inst.institution_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.field}><label style={styles.label}>Password *</label><input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} required /></div>
                            <div style={styles.field}><label style={styles.label}>Confirm Password *</label><input style={styles.input} name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required /></div>
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Registering...' : 'Register'}</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Enter Code *</label>
                            <input style={styles.input} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" required />
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Verifying...' : 'Verify Code'}</button>
                        <button type="button" disabled={resendLoading} onClick={handleResendOTP} style={styles.linkButton}>
                            {resendLoading ? 'Sending new code...' : "Didn't get a code? Resend OTP"}
                        </button>
                    </form>
                )}
                <button onClick={onBackToLogin} style={{ ...styles.linkButton, marginTop: '10px', color: '#666' }}>Back to Login</button>
            </div>
        </div>
    );
}
// --- FRAGMENT 3: CSS INLINE STYLING SYSTEM ---
const styles = {
    container: { display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
    card: { border: '1px solid #ddd', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '100%', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    header: { textAlign: 'center', marginBottom: '25px' },
    logo: { margin: 0, fontSize: '28px', color: '#007bff' },
    logoSub: { color: '#666', fontSize: '13px', margin: '5px 0' },
    title: { fontSize: '20px', color: '#333', margin: '15px 0 0 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontWeight: 'bold', fontSize: '13px', color: '#555' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
    button: { padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    linkButton: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' },
    error: { color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', border: '1px solid #f5c6cb' },
    successBox: { color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', border: '1px solid #c3e6cb', textAlign: 'center' }
};
