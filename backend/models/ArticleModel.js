import { Schema, model } from "mongoose";

//create user comment schema
const userCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String
    }
})

//create article schema
const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "Author Id required"]
    },
    title: {
        type: String,
        required: [true, "Title required"]
    },
    content: {
        type: String,
        required: [true, "Content Is required"]
    },
    category: {
        type: String,
        required: [true, "Category Is required"]
    },
    comments: [userCommentSchema],
    isArticleActive:{
        type: Boolean,
        default: true
    }
},
{
    strict: "throw",
    timestamps: true,
    versionKey: false
})

//create model and export
export const ArticleModel = model('article', articleSchema)