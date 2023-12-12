import axios from "axios";

const LINK_API = process.env.REACT_APP_API_LINK;
const LINK_API_SHIPPER = process.env.REACT_APP_API_LINK_SHIPPER;
const LINK_API_DEFAULT = process.env.REACT_APP_API_LINK_DEFAULT;
const LINK_API_STAFF = process.env.REACT_APP_API_LINK_STAFF;

const createAxiosInstance = (token) => {
    return axios.create({
        baseURL: LINK_API,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const GetShipper = async (data, token) => {

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "shippers?" + path);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return [];
    }
};

export const CreateShipper = async (id, data, token) => {
    data.roleId = 5
    console.log(data);
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.post(`${LINK_API_DEFAULT}store/api/accounts/add-shipper?storeId=${id}`, data);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return error?.response?.status;
    }
};

export const DeleteShipper = async (id, token) => {

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.delete(`${LINK_API}` + "shippers?id=?" + id);
        return response;
    } catch (error) {
        console.log("DeleteShipper in api/order.js error : ", error);
        return error?.response?.status;
    }
};

export const UpdateStatusShipper = async (id, status, token) => {
    const data = {
        status: status
    }
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API}` + "shippers/status?id=?" + id, data);
        return response;
    } catch (error) {
        console.log("UpdateStatusShipper in api/order.js error : ", error);
        return error?.response?.status;
    }
};

export const ActiveShipper = async (accountId, zoneId, token) => {
    console.log((`${LINK_API_STAFF}` + `accounts/active-shipper?accountId=${accountId}&zoneId=${zoneId}`));
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API_STAFF}` + `accounts/active-shipper?accountId=${accountId}&zoneId=${zoneId}`);
        return response;
    } catch (error) {
        console.log("ActiveShipper in api/shipper.js error : ", error);
        return error?.response?.status;
    }
};

export const DeactiveShipper = async (accountId, token) => {

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API_STAFF}` + `accounts/inactive-shipper?accountId=${accountId}`);
        return response;
    } catch (error) {
        console.log("DeactiveShipper in api/shipper.js error : ", error);
        return error?.response?.status;
    }
};


