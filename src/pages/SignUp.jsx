import { useState } from "react";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import { Link, useNavigate } from "react-router-dom";  
import { ReactComponent as RightArrow } from "../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase.config";

const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({email: "", password: "", name: ""})

    const {email, password, name} = formData

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            const user = userCredential.user

            updateProfile(auth.currentUser, {displayName: name})

            navigate('/')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome!</p>
                </header>
                
                <form onSubmit={onSubmit}>
                    <input type="text" className="nameInput" placeholder="Name" id="name" value={name} onChange={onChange}/>
                    <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={onChange}/>
                    <div className="passwordInputDiv">
                        <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange}/>
                        <img src={VisibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevValue) => !prevValue)}/>
                    </div>

                    <div className="signUpBar">
                        <p className="singUpText">Sign Up</p>
                        <button className="signUpButton">
                            <RightArrow fill="#ffffff" width={34} height={34}/>
                        </button>
                    </div>
                </form>

                <Link to='/sign-in' className="registerLink">Already Have An Account?</Link>
            </div>
        </>
    );
 }

 export default SignUp;