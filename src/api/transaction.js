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
        console.log("GetAllShipper in api/account.js error : ", error);
        return [];
    }
};
