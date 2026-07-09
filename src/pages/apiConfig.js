// apiConfig.js
const BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
    INSTITUTIONS: `${BASE_URL}/api/institutions/`,
    REGISTER: `${BASE_URL}/api/applicant/register/`,
    VERIFY: `${BASE_URL}/api/applicant/verify/`,
    RESEND_OTP: `${BASE_URL}/api/applicant/resend-otp/`,
    LOGIN: `${BASE_URL}/api/token/`, 
};
