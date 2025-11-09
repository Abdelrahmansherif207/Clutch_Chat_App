import { axiosInstance } from '../axios'

export const checkAuth = async () => {
    try {
        const { data } = await axiosInstance.get("/auth/check")
        return { data, error: null }
    } catch (err) {
        console.error("Error in checkAuth API call:", err)
        return { data: null, err }
    }
}


export const signUp = async (signupDto) => {
    try {
        const { data } = await axiosInstance.post("/auth/signup", signupDto);
        return { data, error: null }
    } catch (error) {
        console.error("Error in sigUp API call: ", error);
        return { data: null, error }
    }
}