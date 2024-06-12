import axios from "axios";

let http = axios.create({
    baseURL: "http://47.97.19.218:8081"
});

http.interceptors.request.use(
    config => {
        let token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default http;
