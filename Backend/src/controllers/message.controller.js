import { throw500 } from "../lib/utils.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from '../lib/cloudinary.js'

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Fetched Users Successfully",
            data: filteredUsers
        });

    } catch (err) {
        console.log("error in get all contacts")
        throw (err, "Unknown error while fetching users", res);
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        })

        return res.status(200).json({
            success: true,
            message: "Fetched messages successfully",
            data: messages
        })
    } catch (err) {
        throw500(err, "Unknonw error while fetching the messages.", res);
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        };

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        // TODO send message in realtime if user is online 

        return res.status(201).json({
            success: true,
            message: "Message Sent Successfully",
            data: newMessage
        })
    } catch (err) {
        throw500(err, "Unknown error while sending message.", res);
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        // find all message where logged in user is either sender or reciver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser }, { reciverId: loggedInUser },
            ]
        });

        const chatPartnerIds = messages.map(
            msg => msg.senderId.toString() === loggedInUser.toString()
                ? msg.reciverId
                : msg.senderId
        );

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Fetched All Chat Partners Successfully.",
            data: chatPartners
        });
    } catch (err) {
        throw500(err, "Unknown error while fetching chat partners.", res);
    }
}