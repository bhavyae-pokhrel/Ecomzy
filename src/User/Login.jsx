import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { login } from "../redux/Slices/authSlice";
import { useForm } from "react-hook-form";

function Login() {
  const dispatch = useDispatch();
  const [hidepassword, setHidePassword] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const findUser = async (data) => {
    console.log("data-->", data);

    await axios
      .post("https://ecomzy-qy66.onrender.com/api/v1/login", data)

      .then((response) => {
        console.log(response); //* Using this, Check where id present in API
        console.log(response.data.user._id);
       //localStorage.setItem("id", response.data.user._id);
       localStorage.setItem("token", response.data.token);
        dispatch(login());
        navigate("/dashboard");
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(findUser)} className="space-y-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold">
            Email:
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">Please enter the email</span>
          )}

          <label
            htmlFor="password"
            className="block text-gray-700 font-semibold mt-4"
          >
            Password:
          </label>
          <div className="relative">
            <input
              id="password"
              type={hidepassword ? "password" : "text"}
              {...register("password", {
                required: true,
                minLength: {
                  value: 6,
                  message: "Please enter a 6-digit password",
                },
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

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>

          <button
            type="button"
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition duration-200 mt-2"
            onClick={() => navigate("/signup")}
          >
            New User
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
