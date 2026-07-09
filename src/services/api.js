import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
});


// Automatically attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const login = (username, password) =>
    API.post('/auth/login/', { username, password });

export const getProfile = () =>
    API.get('/auth/profile/');

// Applicant Registration
export const registerApplicant = (data) =>
    API.post('/applicant/register/', data);

export const verifyApplicant = (username, otp_code) =>
    API.post('/applicant/verify/', { username, otp_code });

export const resendOtp = (username) =>
    API.post('/auth/resend-otp/', { username });

// Scoring
export const scoreIndividual = (formData) =>
    API.post('/score/individual/', formData);

export const scoreBatch = (formData) =>
    API.post('/score/batch/', formData);

// Records
export const getScores = (params) =>
    API.get('/scores/', { params });

export const getScoreDetail = (id) =>
    API.get(`/scores/${id}/`);

export const getApplicantHistory = (ref) =>
    API.get(`/applicants/${ref}/`);

// Dashboard
export const getDashboardStats = () =>
    API.get('/dashboard/stats/');

// Admin
export const getRules = () =>
    API.get('/rules/');

export const updateRule = (id, data) =>
    API.put(`/rules/${id}/`, data);

export const getBatches = () =>
    API.get('/batches/');

export const getInstitutions = () =>
    API.get('/institutions/');

// Applicant own data
export const getMyScores = () =>
    API.get('/applicant/my-scores/');

export const updateMyProfile = (data) =>
    API.patch('/applicant/my-profile/', data);

export default API;