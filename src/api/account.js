import axios from "axios";
import { ACCOUNT } from "../constants/account";

const LINK_API = process.env.REACT_APP_API_LINK;
const LINK_API_SHIPPER = process.env.REACT_APP_API_LINK_SHIPPER;
const LINK_API_DEFAULT = process.env.REACT_APP_API_LINK_DEFAULT;

const createAxiosInstance = (token) => {
    return axios.create({
        baseURL: LINK_API,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const GetAllAccount = async (token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "accounts");
        return response;
    } catch (error) {
        console.log("GetAllAccount in api/account.js error : ", error);
        return [];
    }
};

export const GetAllShipper = async (token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "accounts?role=" + ACCOUNT.SHIPPER.value);
        return response;
    } catch (error) {
        console.log("GetAllShipper in api/account.js error : ", error);
        return [];
    }
};

export const EditAccount = async (id, data, token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + "accounts?id=" + id, data);
        return response;
    } catch (error) {
        console.log("EditAccount in api/account.js error : ", error);
        return "Lỗi EditAccount,", error?.response?.status;
    }
};
