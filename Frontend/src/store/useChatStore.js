import { create } from "zustand";
import { getAllContacts, getMessagesByUserId, getMyChatPartners } from "../lib/api/chat";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,
    isMessagesLoading: false,


    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (usr) => set({ selectedUser: usr }),

    getAllContacts: async () => {
        set({ isUsersLoading: true })
        const { data, error } = await getAllContacts();
        set({
            allContacts: error ? [] : data.data,
            isUsersLoading: false
        })
        // if (error) toast.error(error.response.data.message);
        // else toast.success(data.message || "Logged out successfully!");
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true })
        const { data, error } = await getMyChatPartners();
        set({
            chats: error ? [] : data.data,
            isUsersLoading: false
        })
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        const { data, error } = await getMessagesByUserId(userId);
        set({
            messages: error ? [] : data.data,
            isMessagesLoading: false
        })
    },


    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        // Immediately show message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            // Replace optimistic message with real one
            set({
                messages: get().messages.map((msg) =>
                    msg._id === tempId ? res.data.data : msg
                ),
            });
        } catch (error) {
            // Remove optimistic message on failure
            set({ messages: get().messages.filter((msg) => msg._id !== tempId) });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

}))