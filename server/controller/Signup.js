const User=require('../models/User') 
const bcrypt=require('bcryptjs')

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

async function uploadFileToCloudinary(file, folder,quality) {
    const options = { folder };
    console.log("temp file path", file.tempFilePath);
    
      if(quality){
          options.quality=quality 
      }  
  
    options.resource_type = "auto";
   
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
    
  
exports.addUser=async(req,res)=>{ 
    try{ 
        console.log('Request Files--->',req.files)
       const { name, email, password,confirmPassword}=req.body
       let image=req.files?.image

        console.log('image--->',image)

        if(!image){ 
            image=`https://api.dicebear.com/5.x/initials/svg?seed=${name}`
            console.log('imageURL send to image',image)
        }
        else{
            const response = await uploadFileToCloudinary(image, process.env.FOLDER_NAME);
            console.log('response in addUser',response)
            image=response.secure_url

        }

       if(!name || !email || !password||!confirmPassword||!image){
        console.log('Please fill the form')
          return res.status(400).json({
            success:false,
            message:'Please fill the form'
           })
       } 

       if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:'Password and ConfirmPassword are not match'
           })
        }
       
       const existingUser=await User.findOne({email});
       if(existingUser){
          console.log('User Already Exist')
           return res.status(400).json({
              success:false,
              data:existingUser,
              message:'User Already Exist'
           })
       }

       let hasedPassword;
        try{
           hasedPassword=await bcrypt.hash(password,10)
        }
        catch(error){
            console.log('Error in Hashing Password')
           return res.status(500).json({
                success:false,
                message:'Error in Hashing Password'
            })
        }

        const user=await User.create({
           name, email, password:hasedPassword,image})
           console.log('Data Sumbit Successfully')
            return res.status(200).json({
                success:true,
                data:user,
                message:'Data Sumbit Successfully'
            })
    

    }
    catch(error){
        console.log('Error in addUser line 106',error.message)
        return res.status(400).json({
            success:false,
            message:'Something Went Wrong'
        })
    }
}