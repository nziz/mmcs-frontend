import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';
const getToken = () => localStorage.getItem('access_token');

export default function ApplicantPortal({ user, onLogout }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('dashboard');
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [file, setFile] = useState(null);
    const [accountAge, setAccountAge] = useState(12);
    const [profileForm, setProfileForm] = useState({});
    const [profileMsg, setProfileMsg] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [selectedScore, setSelectedScore] = useState(null);

    // FIXED: Wrapped in useCallback to make it a stable dependency
    const fetchPortalData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/applicant/portal/`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setData(res.data);
            setProfileForm({
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                email: user?.email || '',
                phone_number: user?.phone_number || '',
            });
        } catch (err) {
            setError('Failed to load your data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]); 

    // FIXED: Added fetchPortalData to the dependency array safely
    useEffect(() => {
        fetchPortalData();
    }, [fetchPortalData]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { setUploadMsg('Please select a CSV file.'); return; }
        setUploading(true);
        setUploadMsg('');
        const formData = new FormData();
        formData.append('transaction_file', file);
        formData.append('account_age_months', accountAge);
        try {
            const res = await axios.post(`${API}/applicant/upload/`, formData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setUploadMsg('✅ ' + res.data.message);
            fetchPortalData();
            setTab('dashboard');
        } catch (err) {
            setUploadMsg('❌ ' + (err.response?.data?.error || 'Upload failed.'));
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMsg('');
        try {
            await axios.put(`${API}/applicant/profile/`, profileForm, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setProfileMsg('✅ Profile updated successfully!');
        } catch (err) {
            setProfileMsg('❌ ' + (err.response?.data?.error || 'Update failed.'));
        }
    };

    const getTierColor = (tier) => ({
        excellent: '#1b5e20', good: '#2e7d32',
        fair: '#f57f17', poor: '#e65100', very_poor: '#b71c1c',
    }[tier] || '#666');

    const getTierBg = (tier) => ({
        excellent: '#e8f5e9', good: '#f1f8e9',
        fair: '#fff8e1', poor: '#fff3e0', very_poor: '#ffebee',
    }[tier] || '#f5f5f5');

    if (loading) return (
        <div style={styles.loadingPage}>
            <div style={styles.loadingCard}>
                <div style={styles.loadingSpinner}>⏳</div>
                <p>Loading your portal...</p>
            </div>
        </div>
    );

    const stats = data?.statistics || {};
    const scores = data?.score_history || [];
    // eslint-disable-next-line no-unused-vars
    const applicant = data?.applicant || {};

    return (
        <div style={styles.page}>
            {/* Top Bar */}
            <div style={styles.topBar}>
                <div style={styles.topLogo}>
                    <span style={styles.topLogoText}>MMCSS</span>
                    <span style={styles.topLogoSub}>Applicant Portal</span>
                </div>
                <div style={styles.topUser}>
                    <span style={styles.topUserName}>
                        {user?.first_name} {user?.last_name}
                    </span>
                    <button style={styles.logoutBtn} onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabBar}>
                {[
                    { key: 'dashboard', label: '📊 My Dashboard' },
                    { key: 'upload', label: '📤 Request Scoring' },
                    { key: 'history', label: '📋 Score History' },
                    { key: 'profile', label: '👤 My Profile' },
                ].map(t => (
                    <button
                        key={t.key}
                        style={tab === t.key ? styles.tabActive : styles.tab}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div style={styles.content}>
                {error && <div style={styles.error}>{error}</div>}

                {/* ── DASHBOARD TAB ── */}
                {tab === 'dashboard' && (
                    <div>
                        <h2 style={styles.pageTitle}>
                            Welcome, {user?.first_name}! 👋
                        </h2>
                        <p style={styles.pageSubtitle}>
                            Here is your credit scoring summary
                        </p>

                        {/* Stats Cards */}
                        <div style={styles.statsGrid}>
                            {[
                                { label: 'Total Scorings', value: stats.total_scorings || 0, color: '#1a237e' },
                                { label: 'Average CSI', value: stats.average_csi ? `${stats.average_csi}/100` : '—', color: '#2e7d32' },
                                { label: 'Latest Score', value: stats.latest_csi ? `${stats.latest_csi}/100` : '—', color: '#f57f17' },
                                { label: 'Latest Tier', value: stats.latest_tier?.replace('_', ' ').toUpperCase() || '—', color: getTierColor(stats.latest_tier) },
                            ].map(item => (
                                <div key={item.label} style={styles.statCard}>
                                    <p style={styles.statLabel}>{item.label}</p>
                                    <p style={{ ...styles.statValue, color: item.color }}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Latest Score Card */}
                        {scores.length > 0 && (
                            <div style={{
                                ...styles.latestCard,
                                backgroundColor: getTierBg(stats.latest_tier),
                                borderLeft: `6px solid ${getTierColor(stats.latest_tier)}`,
                            }}>
                                <h3 style={styles.latestTitle}>Your Latest Credit Score</h3>
                                <div style={styles.latestScore}>
                                    <span style={{
                                        ...styles.csiNumber,
                                        color: getTierColor(stats.latest_tier),
                                    }}>
                                        {stats.latest_csi}
                                    </span>
                                    <span style={styles.csiMax}>/100</span>
                                </div>
                                <div style={styles.latestTierBadge}>
                                    <span style={{
                                        background: getTierColor(stats.latest_tier),
                                        color: '#fff', padding: '6px 20px',
                                        borderRadius: '20px', fontSize: '14px',
                                        fontWeight: '700',
                                    }}>
                                        {stats.latest_tier?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── UPLOAD TAB ── */}
                {tab === 'upload' && (
                    <div style={styles.card}>
                        <h3>Request New Credit Scoring</h3>
                        <form onSubmit={handleUpload} style={styles.form}>
                            <label style={styles.label}>Account Age (Months)</label>
                            <input 
                                type="number" 
                                value={accountAge} 
                                onChange={(e) => setAccountAge(e.target.value)} 
                                style={styles.input} 
                            />
                            <label style={styles.label}>Upload Bank Statement / Transaction CSV</label>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={(e) => setFile(e.target.files[0])} 
                                style={styles.input} 
                            />
                            <button type="submit" disabled={uploading} style={styles.submitBtn}>
