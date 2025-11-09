import { create } from 'zustand'
import { checkAuth, logIn, signUp, logOut, updateProfile } from '../lib/api/auth'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningup: false,
    isLoggingIn: false,
    isLogginOut: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

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
        else {
            toast.success(data.message || "Account Created successful!");
            get().connectSocket();
        }
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
        else {
            toast.success(data.message || "Logged in successfully!");
            get().connectSocket();
        }
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
        else {
            toast.success(data.message || "Logged out successfully!");
            get().disconnectSocket();
        }
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
    },


    connectSocket: () => {
        const { authUser } = get();
        if (!authUser) {
            console.log("connectSocket: No authenticated user, skipping socket connection.");
            return;
        }
        if (get().socket?.connected) {
            console.log("connectSocket: Socket already connected.");
            return;
        }
        console.log("connectSocket: Creating socket connection...");
        const socket = io(BASE_URL, { withCredentials: true });

        // ✅ SET UP ALL LISTENERS BEFORE CONNECTING
        socket.on("getOnlineUsers", (userIds) => {
            console.log("connectSocket: Received online users:", userIds);
            set({ onlineUsers: userIds });
        });

        socket.on("connect", () => {
            console.log("connectSocket: Socket connected with id:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("connectSocket: Socket disconnected. Reason:", reason);
        });

        socket.on("connect_error", (error) => {
            console.log("connectSocket: Socket connection error:", error);
        });

        // ✅ NOW CONNECT - listeners are ready
        socket.connect();
        console.log("connectSocket: Socket connection initiated.");

        set({ socket });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            console.log("disconnectSocket: Disconnecting socket...");
            socket.disconnect();
        } else {
            console.log("disconnectSocket: No connected socket to disconnect.");
        }
    },

}))