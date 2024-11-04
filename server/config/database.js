const mongoose=require("mongoose");
require("dotenv").config();

const dbConnect=()=>{
  mongoose.connect(process.env.DATABASE_URL,{

  })
  .then(()=>{
      console.log('DB is connect')
  })
  .catch((error)=>{
    console.log('DB is not connect',error.message)
  })
  
} 
 
module.exports=dbConnect  