import { useLocation, useNavigate } from "react-router-dom";
import googleIcon from "../assets/svg/googleIcon.svg"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"; 

const GoogleAuth = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const onGoogleClick = async () => {

        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')

        } catch (error) {
            toast.error("Something Went Wrong with Google Authentication!")
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