import { useLocation } from "react-router-dom";
import googleIcon from "../assets/svg/googleIcon.svg"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";

const GoogleAuth = () => {

    const location = useLocation()

    const onGoogleClick = async () => {

        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
        } catch (error) {
            toast.error("Something Went Wrong!")
        }

    }

    return (
        <div className="socialLogin">
            <p>Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with</p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img src={googleIcon} alt="Google Icon" className="socialIconImg"/>
            </button>
        </div>
    );
}

export default GoogleAuth; 