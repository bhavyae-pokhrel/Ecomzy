import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setSignupData } from "../redux/Slices/authSlice";
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";

function SignUp() {
  const dispatch= useDispatch()

  const [hidepassword,setHidePassword]=useState(true)
  const [hideConfirmpassword,setHideConfirmPassword]=useState(true)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState:{errors},
  }=useForm({mode: "onSubmit"});

  const password=watch("password","") //! track password to compare

  
  const SubmitForm = async (data) => { 

      dispatch(setSignupData({
        name: data.name,
        email: data.email,
        image:data.image[0],
        password: data.password,
        confirmPassword: data.confirmPassword, 
      }));


   await axios.post("https://ecomzy-qy66.onrender.com/api/v1/otp",{ email: data.email })
    .then((response)=>{
      navigate("/verifyemail")
      toast.success(response.data.message)   
   })
   .catch((error)=>{
      toast.error(error.response.data.message)     
   }) 
  }            

return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="container max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(SubmitForm)} className="space-y-4">
        
        <label htmlFor="name" className="block text-gray-700 font-semibold">
          Name: <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name', {
            required: true,
            minLength: { value: 3, message: 'Minimum length should be 3' },
          })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">
            {errors.name.message}
          </span>
        )}

        <label htmlFor="email" className="block text-gray-700 font-semibold">
          Email: <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            Please enter the email
          </span>
        )}

        <label htmlFor="photo" className="block text-gray-700 font-semibold">
          Upload Picture:
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          {...register('image')}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
        />

        <label htmlFor="password" className="block text-gray-700 font-semibold">
          Password: <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={hidepassword ? "password" : "text"}
            {...register('password', {
              required: true,
              minLength: { value: 6, message: 'Please enter a 6-digit password' },
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setHidePassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {hidepassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        <label htmlFor="confirmpassword" className="block text-gray-700 font-semibold">
          Confirm Password: <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmpassword"
            type={hideConfirmpassword ? "password" : "text"}
            {...register('confirmPassword', {
              required: true,
              minLength: { value: 6, message: 'Please enter a 6-digit password' },
              validate: (value) => value === password || "Passwords do not match",
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setHideConfirmPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {hideConfirmpassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>

        <button
          type="button"
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition duration-200"
          onClick={() => navigate("/")}
        >
          Already User
        </button>
      </form>
    </div>
  </div>
);

}

export default SignUp;