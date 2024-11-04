import { Routes } from "react-router-dom";
import Navbar from "./components/Navbar"
import { Route } from "react-router-dom";
import Home from "./pages/Home"
import Login from './User/Login'
import Signup from './User/Signup'
import VerifyEmail from "./User/VerifyEmail"
import Cart from "./pages/Cart"
import { useEffect } from "react";


import { useSelector } from "react-redux";
import PrivateRouter from "./Private/PrivateRouter";

const App = () => {
  const {isLoggedIn}=useSelector((state)=>state.auth)
  // (Redux State): This flag is part of your Redux state, which gets reset whenever the page is refreshed. It indicates whether the user is currently logged in during a session but doesn’t persist between page reloads.
  //token (Local Storage): The token stored in localStorage is persistent across page reloads. It acts as a fallback to verify that the user was previously authenticated, even after a refresh. If isLoggedIn is false after a refresh but the token is still present, you can use the token to set isLoggedIn back to true.

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("token");
    };
  
    window.addEventListener("beforeunload", handleUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);
  // localStorage.removeItem("token") runs after the initial state is set in the Redux slice 

  return (<div>
        <div className="bg-slate-900">
          <Navbar/>
        </div>
        <Routes>
          <Route path="/dashboard" element={<PrivateRouter isLoggedIn={isLoggedIn}><Home/></PrivateRouter>}/>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/verifyemail" element={<VerifyEmail/>}/>
          <Route path="/cart" element={<Cart/>} />
        </Routes>
  </div>)
};

export default App;
