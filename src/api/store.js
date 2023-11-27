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

