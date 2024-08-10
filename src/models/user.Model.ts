import mongoose, { Document, Schema } from "mongoose"

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new mongoose.Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now}
});


interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean;
    messages: Message[]
}

const userSchema: Schema<User> = new mongoose.Schema({
    username: {type: String, required: [true, "Username is required"], trim: true, unique: true},
    email: {type: String, required: [true, "Email is required"], unique: true, match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please use a valid email address"]}, // regex 
    password: {type: String, required: [true, "Password is required"]},
    verifyCode: {type: String, required: [true, "Verify code is required"]},
    verifyCodeExpiry: {type: Date, required: [true, "Verify code expiry is required"]},
    isVerified: {type: Boolean, default: false},
    isAcceptingMessage: {type: Boolean, default: true},
    messages: {type: [messageSchema]}
});

// Basically Next.js runs at the edge time it doesn't know that server is running on first time or already running exist so in this case we have to follow up the below synatax 

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema)) // we are going to tell that check first whether mongoose already has a User model in the models list and also tell them the returning data-type is not a generic but we provide a mongoose.Model<User> 

export default UserModel;