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

export const GetAllRole= async (token) => {
    try {
        const instance = createAxiosInstance(token);
        const response = await instance.get(`${LINK_API}` + "roles");
        return response;
    } catch (error) {
        console.log("GetAllRole in api/account.js error : ", error);
        return [];
    }
};