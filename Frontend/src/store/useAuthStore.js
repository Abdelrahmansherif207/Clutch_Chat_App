import { create } from 'zustand'
import { checkAuth, signUp } from '../lib/api/auth'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningup: false,

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
        if (error) toast.error(error.response.data.message);
        else toast.success("Account Created successful!");
    }
}))