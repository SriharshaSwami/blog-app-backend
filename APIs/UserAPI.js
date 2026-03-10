import exp from 'express'
import { register } from '../services/AuthService.js'
import { verifyToken } from '../Middlewares/verifyToken.js'
import { checkUser } from '../Middlewares/checkUser.js'
import { ArticleModel } from '../models/ArticleModel.js'
//create mini server
export const userRoute = exp.Router()

//Register user(public)
userRoute.post('/users', async (req, res) =>{

    //get userObj from body
    let userObj = req.body

    //call register
    const newUserObj = await register({...userObj, role: "USER"})
    //send res
    res.status(201).json({message: "User created", payload: newUserObj})
})


//Read all articles(protected)
userRoute.get('/articles', verifyToken("USER"), checkUser, async(req, res) =>{
    //middleware already checks for user
    let articles = await ArticleModel.find({isArticleActive: true})

    //send res
    res.status(200).json({message: "Articles are", payload: articles})
})

//Add comment to an article(protected)
userRoute.put('/articles', verifyToken('USER'), checkUser, async (req,res) =>{
    //get commentText and articleId from req body
    let {userId, articleId, comment} = req.body

    //check user(req.user)
    if(String(userId) !== String(req.user.userId)){
        return res.status(403).json({message: "User is Forbidden"})
    }

    //find article
    let articleWithComment = await ArticleModel.findByIdAndUpdate(articleId,
        {$push: {comments: {user: userId, comment}}},
        {new: true, runValidators: true}
    )
    //if article not found
    if(!articleWithComment){
        return res.status(404).json({message: "Article not found"})
    }

    //send res
    res.status(200).json({message: "Commented successfully", payload: articleWithComment})
})
