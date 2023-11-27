import axios from "axios";

const LINK_API = process.env.REACT_APP_API_LINK;
const LINK_API_SHIPPER = process.env.REACT_APP_API_LINK_SHIPPER;

const createAxiosInstance = (token) => {
    return axios.create({
        baseURL: LINK_API,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const signIn = async (data) => {
    console.log(LINK_API);
    try {
        const response = await axios.post(`${LINK_API}` + "logins", data);
        return response;
    } catch (error) {
        return error;
    }
};

export const signInWithOtp = async (mail) => {
    try {
        const response = await axios.post(`${LINK_API}` + `logins/otp?email=${mail}`);
        return response;
    } catch (error) {
        return [];
    }
};

export const verifyOtp = async (mail, otp) => {
    try {
        const response = await axios.get(`${LINK_API}` + `logins/verify-otp?email=${mail}&otp=${otp}`);
        return response;
    } catch (error) {
        return error;
    }
};


export const signUp = async (data) => {
    try {
        const response = await axios.post(`${LINK_API}` + "/auth/signup", data);
        return response;
    } catch (error) {
        console.error("Error singup:", error);
        return error;
    }
};

export const forgotPassword = async (mail) => {
    try {
        const response = await axios.put(`${LINK_API}` + `accounts/forgot-password?email=${mail}`);
        return response;
    } catch (error) {
        return [];
    }
};

export const forgotOtp = async (mail, otp) => {
    try {
        const response = await axios.get(`${LINK_API}` + `accounts/verify-forgot?email=${mail}&otp=${otp}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const newPassword = async (mail, password) => {
    try {
        const response = await axios.post(`${LINK_API}` + `accounts/reset-password?email=${mail}&newPassword=${password}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const getStoreInfor = async (token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "logins/accesstoken-to-infostore");
        return response;
    } catch (error) {
        return error;
    }
};

