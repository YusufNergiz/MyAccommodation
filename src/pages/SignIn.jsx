import { useState } from "react";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import { Link } from "react-router-dom";  
import { ReactComponent as RightArrow } from "../assets/svg/keyboardArrowRightIcon.svg";  

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({email: "", password: ""})

    const {email, password} = formData

    const onChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = () => {
        return
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                
                <form onSubmit={onSubmit}>
                    <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={onChange}/>
                    <div className="passwordInputDiv">
                        <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange}/>
                        <img src={VisibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevValue) => !prevValue)}/>
                    </div>
                    <Link to='/forgot-password' className="forgotPasswordLink">Forgot Password</Link>

                    <div className="signInBar">
                        <p className="singInText">Sign In</p>
                        <button className="signInButton">
                            <RightArrow fill="#ffffff" width={34} height={34}/>
                        </button>
                    </div>
                </form>

                <Link to='/sign-up' className="registerLink">Sign Up Instead</Link>
            </div>
        </>
    );
 }

 export default SignIn;