const bcrypt = require("bcryptjs")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body
       
      if (!email || !password) {
       
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
     
      const user = await User.findOne({ email })
  
      if (!user) {
        
        return res.status(401).json({
          success: false,
          message: `User is not Registered`,
        })
      }
  
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id}, 
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )

        user.token = token
        user.password = undefined
       
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }

       
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        }) 
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } catch (error) {
      console.error(error)
     
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }