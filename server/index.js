const express=require('express');
const app=express();

require('dotenv').config()
app.use(express.json())

const fileuploading = require("express-fileupload");
app.use(fileuploading({
  useTempFiles: true,
  tempFileDir: '/tmp'
}));
 

//! Middlewares
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
  

const router=require("./routes/route")
app.use('/api/v1',router)

const dbConnect = require("./config/database");
dbConnect();

const cloudinary=require("./config/cloudinary")
cloudinary.cloudinaryConnect()

app.get('/',(req,res)=>{
    res.send(`<h1>Shppoing App Backend</h1>`)
})

app.listen(process.env.PORT,()=>{
    console.log('App Running in 5000')
})