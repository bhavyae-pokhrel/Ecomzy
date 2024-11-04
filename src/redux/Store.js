import { combineReducers } from "@reduxjs/toolkit";
import CartSlice from "./Slices/CartSlice";
import authSlice from "./Slices/authSlice";

export const rootReducer = combineReducers({
    cart: CartSlice, 
    auth: authSlice, 
});

export default rootReducer;