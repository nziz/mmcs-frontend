// api.js
import axios from 'axios';
import { API_ENDPOINTS } from './apiConfig';

export const fetchInstitutions = async () => {
    const response = await axios.get(API_ENDPOINTS.INSTITUTIONS);
    return response.data;
};

export const registerApplicant = async (formData) => {
    const response = await axios.post(API_ENDPOINTS.REGISTER, formData);
    return response.data;
};

export const verifyApplicantOtp = async (username, otpCode) => {
    const response = await axios.post(API_ENDPOINTS.VERIFY, { username, otp_code: otpCode });
    return response.data;
};

export const resendOtpToken = async (username) => {
    const response = await axios.post(API_ENDPOINTS.RESEND_OTP, { username });
    return response.data;
};

export const loginUser = async (username, password) => {
    const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });
    return response.data;
};
