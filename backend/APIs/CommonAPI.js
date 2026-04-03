import exp from 'express'
import { authenticate } from "../services/AuthService.js"
import { verifyToken } from '../Middlewares/verifyToken.js'
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import bcrypt from "bcryptjs"

//create mini server
export const commonRoute = exp.Router()

//login
commonRoute.post('/login', async (req, res) => {
    //get user credentials obj from req body
    let userCred = req.body
    if (userCred.email) {
        userCred.email = userCred.email.toLowerCase();
    }
    //call authenticate service
    let {token, user} = await authenticate(userCred)
    //save received token as HttpOnlyCookie
    res.cookie("token", token,{
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/"
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
        sameSite: 'lax',
        path: "/"
    })

    res.status(200).json({ message: "Logged out successfully" })
})

//Change password
commonRoute.put('/change-password', verifyToken('USER', 'AUTHOR', 'ADMIN'), async (req, res) => {
    //get current and new pass
    let { currentPassword, newPassword } = req.body

    //get current session user details
    const userEmail = req.user?.email?.toLowerCase()
    if (!userEmail) {
        return res.status(401).json({ message: "Unauthorized request" })
    }

    //get user from DB using case-insensitive query
    const userInDb = await UserTypeModel.findOne({ email: { $regex: new RegExp(`^${userEmail}$`, 'i') } })
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

//handle refresh
commonRoute.get('/check-auth', verifyToken('USER', 'AUTHOR', 'ADMIN'), async (req, res) =>{
    //get user from DB using case-insensitive query (robust case handling)
    const userInDb = await UserTypeModel.findOne({ email: { $regex: new RegExp(`^${req.user.email}$`, 'i') } }).lean()
    if(!userInDb){
        return res.status(404).json({message: "User not found"})
    }

    //remove password
    delete userInDb.password

    res.status(200).json({
        message: 'authenticated',
        payload: userInDb
    })
})

//get article by id
commonRoute.get('/articles/:id', verifyToken('USER', 'AUTHOR', 'ADMIN'), async (req, res) => {
    const { id } = req.params
    console.log("CommonAPI - Requested ID:", id)
    
    // Diagnostic: Log all IDs in DB
    const allIds = await ArticleModel.find({}, '_id').lean()
    console.log("CommonAPI - Available IDs in DB:", allIds.map(a => a._id.toString()))

    const article = await ArticleModel.findById(id).populate("author", "firstName lastName email profileImageUrl")
    console.log("CommonAPI - Found article:", article ? article.title : "NULL")
    
    if (!article) {
        return res.status(404).json({ message: "Article not found" })
    }

    // If article is inactive, only allow the author or an ADMIN to see it
    if (!article.isArticleActive && req.user.role !== 'ADMIN' && String(article.author._id) !== String(req.user.userId)) {
        return res.status(403).json({ message: "This article is deactivated and only visible to the author." })
    }

    res.status(200).json({ message: "Article found", payload: article })
})