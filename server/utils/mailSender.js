const nodemailer=require("nodemailer")
require("dotenv").config();

const mailSender=async(email,title,body)=>{
    try{
        
       let transporter=nodemailer.createTransport({
        
        host:process.env.MAIL_HOST,  //host:'ABC',
        auth:{
            user:process.env.MAIL_USER,  // user:'ABC',
            pass:process.env.MAIL_PASS,    //pass:'ABC'
        },
        secure:false
       })

       let info=await transporter.sendMail({
        from: "Advance-Todo,  by-bhavyaeprasadpokhrel@gmail.com" , 
        to: `${email}`, 
        subject: `${title}`, 
        html: `${body}`,
       })
       console.log('information--->',info.response);
       return info

    }
    catch(error){
        console.log(error.message);
    }
}
module.exports=mailSender