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

export const GetOrder = async (data, token) => {

    // id status storeId batchId shipperId tracking_number tracking_number distance_price subtotal_price totalPrice other

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "orders?" + path);
        return response;
    } catch (error) {
        console.log("GetOrder in api/order.js error : ", error);
        return [];
    }
};

export const GetOrderWithoutToken = async (orderId) => {
    try {
        const response = await axios.get(`${LINK_API}orders-cus?id=${orderId}`);
        return response;
    } catch (error) {
        console.log("GetOrderWithoutToken in api/order.js error : ", error);
        return [];
    }
};

export const PostOrder = async (data, token) => {

    // storeId batchId

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.post(`${LINK_API}` + "orders", data);
        return response;
    } catch (error) {
        return [];
    }
};

export const PutOrder = async (id, data, token) => {

    // status cancelReason other

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.post(`${LINK_API}` + "orders?id=" + id, data);
        return response;
    } catch (error) {
        console.log("PutOrder in api/order.js error : ", error);
        return [];
    }
};

export const InteractOrder = async (data, token) => {

    let path = ""

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            path += `${key}=${data[key]}&`
        }
    }

    try {
        const instance = createAxiosInstance(token);
        const response = await instance.put(`${LINK_API_SHIPPER}orders?${path}`);
        return response;
    } catch (error) {
        console.log("InteractOrder in api/order.js error : ", error);
        return error;
    }
};
