import axios from "axios"

const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api"

type RegisterData = {
    username: string
    email: string
    password: string
    confirmPassword: string
    avatar?: File | null
}

type LoginData = {
    email: string
    password: string
}

export function registerUser(data: RegisterData) {
    const body = new FormData()
    body.append("username", data.username)
    body.append("email", data.email)
    body.append("password", data.password)
    body.append("password_confirmation", data.confirmPassword)
    if (data.avatar) body.append("avatar", data.avatar)

    return axios.post(`${BASE_URL}/register`, body)
}

export function logInUser(data: LoginData) {
    return axios.post(`${BASE_URL}/login`, {
        email: data.email,
        password: data.password,
    })
}

