import exp from 'express'
import { register } from '../services/AuthService.js'
import { verifyToken } from '../Middlewares/verifyToken.js'
import { checkUser } from '../Middlewares/checkUser.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import { upload } from "../config/multer.js"
import cloudinary from "../config/cloudinary.js"

//create mini server
export const userRoute = exp.Router()
//Register user(public)
userRoute.post(
    "/users",
    upload.single("profilePic"),
    async (req, res, next) => {
        let cloudinaryResult;

        try {
            let userObj = req.body;

            //  Step 1: upload image to cloudinary from memoryStorage (if exists)
            if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            }

            // Step 2: call existing register()
            const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
            });

            res.status(201).json({
                message: "user created",
                payload: newUserObj,
            });

        } catch (err) {

            // Step 3: rollback 
            if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
            }

            next(err); // send to your error middleware
        }

    })
//Read all articles(protected)
userRoute.get('/articles', verifyToken("USER"), checkUser, async (req, res) => {
    //middleware already checks for user
    let articles = await ArticleModel.find({ isArticleActive: true }).populate("comments.user", "firstName lastName email profileImageUrl")

    //send res
    res.status(200).json({ message: "Articles are", payload: articles })
})
//Add comment to an article(protected)
userRoute.put('/articles', verifyToken('USER'), checkUser, async (req, res) => {
    //get commentText and articleId from req body
    let { userId, articleId, comment } = req.body

    //check user(req.user)
    if (String(userId) !== String(req.user.userId)) {
        return res.status(403).json({ message: "User is Forbidden" })
    }

    //find article
    let articleWithComment = await ArticleModel.findByIdAndUpdate(articleId,
        { $push: { comments: { user: userId, comment } } },
        { new: true, runValidators: true }
    ).populate("comments.user", "firstName lastName email profileImageUrl")
    //if article not found
    if (!articleWithComment) {
        return res.status(404).json({ message: "Article not found" })
    }

    //send res
    res.status(200).json({ message: "Commented successfully", payload: articleWithComment })
})
//Read single article by ID
userRoute.get('/article/:id', verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
    const { id } = req.params;
    const article = await ArticleModel.findById(id).populate("author", "firstName lastName email profileImageUrl");

    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({ message: "Article found", payload: article });
})
