import { UserTypeModel } from "../models/UserModel.js"
export const checkUser = async (req, res, next) => {
    //get author id
    let userId = req.params?.uid || req.body?.userId || req.user?.userId

    //verify user
    let user = await UserTypeModel.findById(userId)
    //if user not found
        if(!user){
           return res.status(401).json({message: "Invalid user"})
        }
    //if user found but role is different
    if(user.role != "USER"){
        return res.status(403).json({message: "You are not a enrolled as User"})
    }
    //if user is blocked
    if(!user.isActive){
        return res.status(403).json({message: "User is not active"})
    }
    //forward request to next
    next()
}
