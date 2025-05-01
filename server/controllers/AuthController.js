import jwt from "jsonwebtoken";
import User from "../modals/UserModal.js";
import process from 'process'
import { renameSync, unlinkSync } from "fs";
import { compare } from "bcrypt";


const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(401).json({
                success: false,
                message: "Email or Password is missing!",
            })
        }

        const user = await User.create({ email, password });

        //generate token and cookie
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
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


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "Email or Password is missing!",
            })
        }

        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            })
        }
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);

        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(404).json({
                success: false,
                message: "Password is Incorrect!",
                auth,
            })
        }
        //generate token and cookie
        console.log("Logged in");
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
            httpOnly: true,
        });

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
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

export const getUserInfo = async (req, res) => {
    try {

        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with the given id not found");

        }
        return res.status(200).json({
            success: "true",
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
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

export const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            return res.status(404).send("FirstName, Lastname and Color is required");
        }


        const userData = await User.findByIdAndUpdate(userId,
            { firstName, lastName, color, profileSetup: true },
            { new: true, runValidators: true });
        if (!userData) {
            return res.status(404).send("User with the given id not found");

        }
        return res.status(200).json({
            success: "true",
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
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

export const addProfileImage = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).send("File is Required");
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);
        const updatedUser = await User.findByIdAndUpdate(req.userId, { image: fileName }, { new: true, runValidators: true });

        return res.status(200).json({
            image: updatedUser.image,
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

export const removeProfileImage = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found!");

        }
        if (user.image) {
            unlinkSync(user.image);
        }

        user.image
            = null;
        await user.save();
        return res.status(200).json({
            success: "true",
            message: "Profile image removed successfully!"
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

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", {maxAge: 1, secure: true, sameSite:"None"})
        return res.status(200).json({
            success: "true",
            message: "Logged out successfully!"
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

