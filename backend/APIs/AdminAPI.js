import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../Middlewares/verifyToken.js'

//create mini servers
export const adminRoute = exp.Router()


//Read all articles(optional)

//Block user route
adminRoute.put('/block',verifyToken('ADMIN'), async (req, res) =>{
    //get userObj from req
    let userObj = req.body
    
    //find user in Db
    const userEmail = userObj.userEmail?.toLowerCase()
    let userInDb = await UserTypeModel.findOne({email: userEmail})
    if(!userInDb){
        return res.status(404).json({message: "User not found"})
    }
    //update user to inactive
    await UserTypeModel.updateOne({email: userObj.userEmail},{$set: {isActive: false}})
    //send res
    res.status(200).json({message: "User blocked"})
})

//Unblock user route
adminRoute.put('/unblock',verifyToken('ADMIN'), async (req, res) =>{
    //get userObj from req
    let userObj = req.body
    
    //find user in Db
    const userEmail = userObj.userEmail?.toLowerCase()
    let userInDb = await UserTypeModel.findOne({email: userEmail})
    if(!userInDb){
        return res.status(404).json({message: "User not found"})
    }
    //update user to active
    await UserTypeModel.updateOne({email: userObj.userEmail},{$set: {isActive: true}})
    //send res
    res.status(200).json({message: "User unblocked"})
})
