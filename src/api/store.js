import axios from "axios";

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

export const GetStore = async (data, token) => {

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }
    // http://localshippercp1-001-site1.htempurl.com/api/stores?accountId=10
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "stores?" + path);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return [];
    }
};

export const CreateStore = async (data, token) => {

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }
    // http://localshippercp1-001-site1.htempurl.com/api/stores?accountId=10
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "stores?" + path);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return [];
    }
};

export const UpdateStore = async (id, status, token) => {

    const data = {
        status: status
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + "stores?id=" + id, data);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return [];
    }
};

export const UpdateStoreTimeDelivery = async (id, timeDelivery, token) => {

    const data = {
        timeDelivery: timeDelivery
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + "stores/set-time-delivery?id=" + id, data);
        return response;
    } catch (error) {
        console.log("UpdateStoreTimeDelivery in api/store.js error : ", error);
        return [];
    }
};

