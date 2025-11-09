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
        console.error("Error in sigup API call: ", error);
        return { data: null, error }
    }
}

export const logIn = async (loginDto) => {
    try {
        const { data } = await axiosInstance.post("/auth/login", loginDto);
        return { data, error: null }
    } catch (error) {
        console.error("Error in login API call: ", error);
        return { data: null, error }
    }
}

export const logOut = async () => {
    try {
        const { data } = await axiosInstance.post("/auth/logout");
        return { data, error: null }
    } catch (error) {
        console.error("Error in logout API call: ", error);
        return { data: null, error }
    }
}


export const updateProfile = async (profilePic) => {
    try {
        const { data } = await axiosInstance.put("/auth/profile", profilePic);
        return { data, error: null }
    } catch (error) {
        console.error("Error in update profile API call", error);
        return { data: null, error }
    }
}

