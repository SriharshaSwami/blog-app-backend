import { UserTypeModel } from "../models/UserModel.js"
export const checkAuthor = async (req, res, next) => {
    //get author id
    let authorId = req.params?.authorId || req.body?.author || req.user?.userId

    //verify author
    let author = await UserTypeModel.findById(authorId)
    //if author not found
        if(!author){
           return res.status(401).json({message: "Invalid author"})
        }
    //if author found but role is different
    if(author.role != "AUTHOR"){
        return res.status(403).json({message: "User is not an author"})
    }
    //if author is blocked
    if(!author.isActive){
        return res.status(403).json({message: "Author is not active"})
    }
    //forward request to next
    next()
}
