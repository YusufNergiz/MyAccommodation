import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as RightArrow } from "../assets/svg/keyboardArrowRightIcon.svg"
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from "react-toastify";

const ForgotPassword = () => {

    const [email, setEmail] = useState('')

    const onChange = (e) => setEmail(e.target.value)

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success("Reset Link Successfully sent!")
        } catch (error) {
            toast.error("Something Went Wrong!")
        }
    }

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Reset Password</p>
            </header>

            <form onSubmit={onSubmit}>
                <input type="email" value={email} id='email' placeholder="Recovery Email" onChange={onChange} className="emailInput"/>
                <Link to='/sign-in' className="forgotPasswordLink">Sign-In</Link>

                <div className="signInBar">
                    <p className="singInText">Send Reset Link</p>
                    <button className="signInButton">
                        <RightArrow fill="#ffffff" width={34} height={34}/>
                    </button>
                </div>
            </form>
        </div>
    );
 }

 export default ForgotPassword;