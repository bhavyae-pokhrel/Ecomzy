
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.auth = async (req, res, next) => {
	try {
		
		const token =req.cookies.token ||req.body.token ||req.header("Authorization").replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		if (!process.env.JWT_SECRET) {
			console.error("JWT_SECRET is not defined in environment variables.");
			return res.status(500).json({ success: false, message: "Server Configuration Error" });
		}

		try {
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decode;
		}
		catch (error) {
			return res.status(401).json({ success: false, message: "token is invalid" });
		}
		next();
	} 
	catch (error) {
		console.log(error)
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};