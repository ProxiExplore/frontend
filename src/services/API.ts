import Axios from "axios";


const API = Axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});
export default API;
