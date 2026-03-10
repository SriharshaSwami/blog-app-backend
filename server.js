import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import cookieParser from 'cookie-parser'
import { commonRoute } from './APIs/CommonAPI.js'
import cors from 'cors'

config() //process.env

//creates express app
export const app = exp()

//ues cors middleware
app.use(cors({
    origin: ['http://localhost:5173']
}))

//add body parser middleware
app.use(exp.json())

//add cookie parser middleware
app.use(cookieParser())

//connect APIs
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute)
app.use('/admin-api', adminRoute)
app.use('/common-api',commonRoute)

//connect to DB
const connectDB = async () => {
    try{
        await connect(process.env.DB_URL)
        console.log("DB connection is successful!")
        //start http server and assign port no
        const port = process.env.PORT || 3000
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    }
    catch(err){
        console.log("DB connection error", err.message)
    }
}
connectDB()

//invalid path handling
app.use((req,res,next) => {
    res.json({message: `${req.url} is Invalid Path`})
})

app.post('/logout', (req,res) =>{
    //clear the cookie name 'token'
    //Must match originam settings
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax'
    })

    res.status(200).json({message: "Logged out successfully"})
})

//err handling middleware
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }
  if (err.name === "StrictModeError") {
    return res.status(400).json({
      message: err.message,
    });
  }
  res.status(500).json({
    message: "Internal Server Error",
  });
});