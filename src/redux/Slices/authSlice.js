import {createSlice} from "@reduxjs/toolkit"

const authSlice=createSlice({
    name:"auth",
    initialState:{ signupData:null,isLoggedIn: Boolean(localStorage.getItem("token"))},
    reducers:{
        login(state){
            state.isLoggedIn=true
        },
        logout(state){
            state.isLoggedIn=false
        },
        setSignupData(state,value){
            state.signupData=value.payload
        }
    },
}) 

export const {logout,login,setSignupData} = authSlice.actions;
export default authSlice.reducer;