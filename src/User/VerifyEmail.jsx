import { useState,useEffect } from 'react';
import OtpInput from "react-otp-input";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import {useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios"
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { login } from '../redux/Slices/authSlice';

function VerifyEmail() {
  const dispatch= useDispatch()

  const navigate=useNavigate()
  const [otp, setOtp] = useState('');

  const {signupData}=useSelector((state)=>state.auth)
  console.log('signupData in VerifyEmail----->',signupData)

  const formData = new FormData();
  formData.append("name", signupData.name);
  formData.append("email", signupData.email);
  formData.append("password", signupData.password);
  formData.append("confirmPassword", signupData.confirmPassword);
  formData.append("image", signupData.image)
  formData.append('otp',otp)


  
  const VerifyData={...signupData,otp}
  console.log('VerifyData--->',VerifyData)
 
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const sendOtp=async(event)=>{
    event.preventDefault();

    await axios.post("https://ecomzy-qy66.onrender.com/api/v1/otp",signupData.email)

    .then((response)=>{
     console.log('VerifyEmail Response--->',response);

      navigate("/dashboard")
      toast.success(response.data.message)
   })
   .catch((error)=>{
      toast.error("User Cant' get OTP Successfully")
       console.log(error.message)    
   }) 
  }

  const handlerVerifyAndSignup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("https://ecomzy-qy66.onrender.com/api/v1/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Signup--->Response data:", response.data);
      dispatch(login());
      console.log("Navigating to dashboard");
      navigate("/")
      toast.success(response.data.message);
    } catch (error) {
      toast.error("User can't get OTP successfully");
      console.error("Error message:", error.message);
    }
  };
  

  return (

  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
  
  <div className="container max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
    <p className="text-gray-700 text-lg mb-4">
      A verification code has been sent to you. 
    </p>
    <p className="text-gray-700 text-lg mb-4 "> Enter the code below:</p>

    <form onSubmit={handlerVerifyAndSignup} className="flex flex-col items-center mb-4">
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span className="mx-2 text-gray-500">-</span>}
        renderInput={(props) => (
          <input
            {...props}
            className="w-16 h-16 border border-gray-300 rounded-md text-center text-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      />

      <button
        type="submit"
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
      >
        Verify Email
      </button>
    </form>

    <div className="flex justify-between items-center w-full">
      <Link to="/signup">
        <button className="mx-3 text-blue-500 hover:text-blue-600 flex items-center gap-x-2">
          <BiArrowBack /> Back To Signup
        </button>
      </Link>
      <button
        className="flex items-center gap-x-2 text-blue-500 hover:text-blue-600"
        onClick={() => sendOtp(signupData.email)}
      >
        <RxCountdownTimer />
        Resend it
      </button>
    </div>
  </div>
</div>
);


}


export default VerifyEmail