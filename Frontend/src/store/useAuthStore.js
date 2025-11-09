import { create } from 'zustand'
import { checkAuth, logIn, signUp, logOut } from '../lib/api/auth'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningup: false,
    isLoggingIn: false,
    isLogginOut: false,

    checkAuth: async () => {
        const { data, error } = await checkAuth()
        set({
            authUser: error ? null : data,
            isCheckingAuth: false
        })
    },

    signup: async (signupDto) => {
        set({ isSigningup: true });
        const { data, error } = await signUp(signupDto)
        set({
            authUser: error ? null : data,
            isSigningup: false
        })
        if (error) toast.error(error.response.data.message || "Error creating account");
        else toast.success(data.message || "Account Created successful!");
        return { data, error };
    },

    login: async (loginDto) => {
        set({ isLoggingIn: true });
        const { data, error } = await logIn(loginDto)
        set({
            authUser: error ? null : data,
            isLoggingIn: false
        })
        if (error) toast.error(error.response.data.message || "Error logging in");
        else toast.success(data.message || "Logged in successfully!");
        return { data, error };
    },

    logout: async () => {
        set({ isLogginOut: true })
        const { data, error } = await logOut()
        set({
            authUser: error ? authUser : null,
            isLogginOut: false
        })
        if (error) toast.error(error.response.data.message);
        else toast.success(data.message || "Logged out successfully!");
    }

}))