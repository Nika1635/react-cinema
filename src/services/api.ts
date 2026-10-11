import axios from "axios"
import { attach401 } from "./unauthorized"

const api = axios.create({
    baseURL: "https://api.kinoxii.redberryinternship.ge/api",
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

attach401(api)

export default api