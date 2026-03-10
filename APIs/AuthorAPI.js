import exp from 'express'
import { register } from "../services/AuthService.js"
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { checkAuthor } from '../Middlewares/checkAuthor.js'
import { verifyToken } from '../Middlewares/verifyToken.js'
//create mini server
export const authorRoute = exp.Router()

//Register author(public)
authorRoute.post('/users', async (req, res) =>{

    //get userObj from body
    let userObj = req.body

    //call register
    const newUserObj = await register({...userObj, role: "AUTHOR"})
    
    //send res
    res.status(201).json({message: "Author created", payload: newUserObj})
})

// //Create article(protected)
authorRoute.post('/articles', verifyToken("AUTHOR"), checkAuthor, async (req, res) => {
    //get article from body
    let atricleObj = req.body

  // always bind article author to logged-in user
  atricleObj.author = req.user.userId

    //author can only create article for own account
    if (atricleObj.author != req.user.userId) {
        return res.status(403).json({ message: "Forbidden" })
    }

    //create article documnet
    const articleDoc = new ArticleModel(atricleObj)

    //save
    let createdArticleDoc = await articleDoc.save()

    //send res
    res.status(201).json({message: "Article published successfully", payload: createdArticleDoc})
})

//Read articles of their own(protected)
authorRoute.get('/articles/:authorId', verifyToken("AUTHOR"), checkAuthor, async(req, res) => {
    //get author id
    let authorId = req.params.authorId

    //already middleware checks author
    let author = await UserTypeModel.findById(authorId)

    //read articles by this author
    let articles = await ArticleModel.find({author: author._id, isArticleActive: true}).populate("author", "firstName email")

    //send res
    res.status(200).json({message: "Articles", payload: articles})
})

//Edit article(protected)
authorRoute.put('/articles', verifyToken("AUTHOR"), checkAuthor, async(req, res) => {
    //get modifiedArticle from req
  let {articleId, title, category, content} = req.body
  const author = req.user.userId

    //find article with the id
    let articleOfDb = await ArticleModel.findOne({_id: articleId, author: author})
    if(!articleOfDb){
    return res.status(404).json({message: "No such article from this author"})
    }

    //author can only modify their own articles
  if (req.user.role === "AUTHOR" && articleOfDb.author.toString() !== req.user.userId) {
      return res.status(403).json({message: "Forbidden"})
    }

    //update the article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,{
        $set: {title, category, content}
    },
        {new: true}
    )

    //send res(updated article)
    res.status(200).json({message: "Article edited", payload: updatedArticle})
})


//delete(soft delete) article(Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id); //.populate("author");
  //console.log(article)
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  //console.log(req.user.userId,article.author.toString())
  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    article,
  });
}); 