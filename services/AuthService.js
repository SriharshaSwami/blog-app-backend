import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserTypeModel } from "../models/UserModel.js"
import { config } from 'dotenv'
config()

//register user function
export const register = async (userObj) =>{

    // Return a client error for duplicate email instead of bubbling as a server error.
    const existingUser = await UserTypeModel.findOne({ email: userObj.email })
    if (existingUser) {
        const err = Error("Email already registered")
        err.status = 409
        throw err
    }

    //create object to validate
    const userDoc = new UserTypeModel(userObj)

    //validate for empty pass
    await userDoc.validate()

    //hash and replace plain pass with hashed pass
    userDoc.password = await bcrypt.hash(userDoc.password, 12)

    //save
    const created = await userDoc.save()

    //convert doc to obj to perform delete 
    const newUserObj = created.toObject()

    //remove password
    delete newUserObj.password

    //return userObj without password
    return newUserObj
}

//authenticate user function
export const authenticate = async ({email, password}) =>{
    //check user with email and role 
    const user = await UserTypeModel.findOne({email})
    if(!user){
        const err = Error("Invalid email")
        err.status = 401
        throw err
    }
    
    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        const err = Error("Invalid password")
        err.status = 401
        throw err
    }

    //check active status
    if(!user.isActive){
        const err = Error("You are blocked, please contact your admin")
        err.status = 403
        throw err
    }

    //generate token
    const token = jwt.sign({userId: user._id, role: user.role, email: user.email},
         process.env.JWT_SECRET,
        {expiresIn: '1h'})
    const userObj = user.toObject()
    delete userObj.password
    return {token, user: userObj}
}