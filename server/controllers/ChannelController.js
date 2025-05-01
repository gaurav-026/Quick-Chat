import mongoose from "mongoose";
import Channel from "../modals/ChannelModal.js";
import User from "../modals/UserModal.js";

export const CreateChannel = async (req, res) => {
    try {
        const {name, members} = req.body;
        const userId  = req.userId;
        const admin = await User.findById(userId);
        if(!admin){
            return res.status(400).send("Admin User not found");
        }
        const validMembers = await User.find({_id: {$in: members}}); //get all the valid member inside this id

        if(validMembers.length !== members.length){
            return res.status(400).send("Some members are not valid users");


        }
        const newChannel = new Channel({
            name, 
            members,
            admin:userId,

        });
        await newChannel.save();



        return res.status(200).json({
            success: "true",
            channel: newChannel
        });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }

};


export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [{admin: userId}, {members: userId}],

        }).sort({updatedAt: -1});


        return res.status(200).json({
            success: "true",
            channels
        });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }

};

export const getChannelMessages = async (req, res) => {
    try {
        const {channelId} = req.params;
        const channel = await Channel.findById(channelId).populate({path: "messages", populate:{
            path:"sender", select:"firstName lastName email _id image color"
        }});
        if(!channel){
            return res.status(404).send("Channel not found.");
        }
        const messages = channel.messages;


        return res.status(200).json({
            success: "true",
            messages
        });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }

};