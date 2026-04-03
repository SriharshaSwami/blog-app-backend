import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName:{
        type: String,
        required: [true, "First name is required"]
    },
    lastName:{
        type: String
    },
    email:{
        type: String,
        required: [true, "Email required"],
        unique: [true, "Email already exists"]
    },
    password:{
        type: String,
        required: [true, "password required"]
    },
    profileImageUrl:{
        type: String
    },
    role:{
        type: String,
        enum: ["AUTHOR", "USER", "ADMIN"],
        required: [true, "{Value} is and Invalid role"]
    },
    isActive:{
        type: Boolean,
        default: true
    }
},
{
    strict: "throw",
    timestamps: true,
    versionKey: false
})

//create model
export const UserTypeModel = model("user", userSchema)