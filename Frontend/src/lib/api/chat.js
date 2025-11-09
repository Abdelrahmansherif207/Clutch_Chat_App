import { axiosInstance } from "../axios";

export const getAllContacts = async () => {
    try {
        const { data } = await axiosInstance.get("/messages/contacts");
        return { data, error: null }
    } catch (error) {
        console.error("Error in Get Contacts API call: ", error);
        return { data: null, error }
    }
}


export const getMyChatPartners = async () => {
    try {
        const { data } = await axiosInstance.get("/messages/chats");
        return { data, error: null }
    } catch (error) {
        console.error("Error in Get Contacts API call: ", error);
        return { data: null, error }
    }
}



export const getMessagesByUserId = async (userId) => {
    try {
        const { data } = await axiosInstance.get(`/messages/${userId}`)
        return { data, error: null }
    } catch (error) {
        console.error("Error in Get Messages By User Id API Call", error);
        return { data: null, error }
    }
}


// export const sendMessage = async()