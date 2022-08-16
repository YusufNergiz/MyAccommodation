import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "./Spinner";

const PrivateRoute = () => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true)
            }
            setInitializing(false)  
        })
    }, [])

    if (initializing) {
        return <Spinner />
    }
    else {
        return (
            loggedIn ? <Outlet /> : <Navigate to='/sign-in'/>
        );
    }
    
}

export default PrivateRoute;