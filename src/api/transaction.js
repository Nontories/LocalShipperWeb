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

export const GetTransaction = async (data, token) => {

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "wallets/wallet-transaction?" + path);
        return response;
    } catch (error) {
        console.log("GetTransaction in api/transaction.js error : ", error);
        return [];
    }
};

export const CreateTransaction = async (fromId, toId, amount, token) => {

    const data = {
        fromWalletId: fromId,
        toWalletId: toId,
        amount: amount
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "wallets​/create-wallet-transaction", data);
        return response;
    } catch (error) {
        console.log("CreateTransaction in api/transaction.js error : ", error);
        return [];
    }
};

export const GetAllTransaction = async (token) => {

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "wallets/wallet-transaction");
        return response;
    } catch (error) {
        console.log("GetAllTransaction in api/transaction.js error : ", error);
        return [];
    }
};

export const SendTransactionOtp = async (mail, token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "accounts/send-otp-wallet?email=" + mail);
        return response;
    } catch (error) {
        console.log("SendTransactionOtp in api/transaction.js error : ", error);
        return error?.response?.status;
    }
};

export const UpdateWalletBalance = async (data, token) => {

    let path = ""
    
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + "wallets?" + path);
        return response;
    } catch (error) {
        console.log("UpdateWalletBalance in api/transaction.js error : ", error);
        return error?.response?.status;
    }
};
