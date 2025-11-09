import { create } from 'zustand'
import { checkAuth, logIn, signUp, logOut, updateProfile } from '../lib/api/auth'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningup: false,
    isLoggingIn: false,
    isLogginOut: false,
    isUpdatingProfile: false,

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
        console.log(data, error)
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
    },

    updateProfile: async (profilePic) => {
        set({ isUpdatingProfile: true })
        const { data, error } = await updateProfile(profilePic);

        set((state) => ({
            authUser: error ? state.authUser : data,
            isUpdatingProfile: false
        }));

        // handle errors
        if (error) toast.error(error.response.data.message);
        else toast.success(data.message || "Updated Profile Successfully!");
    }

}))