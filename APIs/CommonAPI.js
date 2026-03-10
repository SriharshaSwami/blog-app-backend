import exp from 'express'
import { authenticate } from "../services/AuthService.js"
import { verifyToken } from '../Middlewares/verifyToken.js'
import { UserTypeModel } from '../models/UserModel.js'
import bcrypt from "bcryptjs"

//create mini server
export const commonRoute = exp.Router()

//login
commonRoute.post('/login', async (req, res) => {
    //get user credentials obj from req body
    let userCred = req.body
    //call authenticate service
    let {token, user} = await authenticate(userCred)
    //save received token as HttpOnlyCookie
    res.cookie("token", token,{
        httpOnly: true,
        sameSite: "lax",
        secure: false
    })
    //send res with user object (including role)
    res.status(200).json({message: "Login success", payload: user})
})

//logout
commonRoute.get('/logout', (req,res) =>{
    //clear the cookie name 'token'
    //Must match original settings
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    res.status(200).json({ message: "Logged out successfully" })
})

//Change password
commonRoute.put('/change-password', verifyToken, async (req, res) => {
    //get current and new pass
    let { currentPassword, newPassword } = req.body

    //get current session user details
    const userEmail = req.user?.email
    if (!userEmail) {
        return res.status(401).json({ message: "Unauthorized request" })
    }

    //get user from DB
    const userInDb = await UserTypeModel.findOne({ email: userEmail })
    if (!userInDb) {
        return res.status(404).json({ message: "User not found" })
    }

    //check if curr pass is correct or not
    let isMatch = await bcrypt.compare(currentPassword, userInDb.password)
    if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
    }

    //replace curr pass with new pass
    const newHashedPassword = await bcrypt.hash(newPassword, 12)

    //set new password
    await UserTypeModel.updateOne({ email: userEmail }, { $set: { password: newHashedPassword } })

    //send res
    res.status(200).json({ message: "Password changed successfully!" })
})