import axios from "axios"

let handler: (() => Promise<boolean>) | null = null

export const setUnauthorizedHandler = (fn: () => Promise<boolean>) => {
    handler = fn
}

export const attach401 = (instance: any) => {
    instance.interceptors.response.use(
        (res: any) => res,
        async (error: any) => {
            const config = error.config
            const isMe = config?.url?.endsWith("/me")
            if (error.response?.status === 401 && localStorage.getItem("token") && !isMe && !config._retried && handler) {
                const loggedIn = await handler()
                if (loggedIn) {
                    config._retried = true
                    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
                    return instance(config)
                }
            }
            return Promise.reject(error)
        }
    )
}

attach401(axios)