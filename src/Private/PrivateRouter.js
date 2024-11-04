import React from 'react'
import { Navigate } from 'react-router-dom'

function PrivateRouter({isLoggedIn,children}) {

    if(isLoggedIn){ 
        return children
    }
    else{
        return <Navigate to="/"/>
    }

}

export default PrivateRouter
//Normal Value: This flag is part of your Redux state, which gets reset whenever the page is refreshed. It indicates whether the user is currently logged in during a session but doesn’t persist between page reloads.

//token (Local Storage): The token stored in localStorage is persistent across page reloads. It acts as a fallback to verify that the user was previously authenticated, even after a refresh. If isLoggedIn is false after a refresh but the token is still present, you can use the token to set isLoggedIn back to true.