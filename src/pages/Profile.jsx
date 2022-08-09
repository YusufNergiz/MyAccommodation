import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {

    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    const navigate = useNavigate()

    const onLogOut = () => {
        auth.signOut()
        navigate('/')
    }

    const handleClick = async (e) => {
        e.preventDefault()

        try {
            setChangeDetails(prevState => !prevState)

            const docRef = doc(db, 'users', auth.currentUser.uid)
            const docSnap = await getDoc(docRef)

            // Update Name of the user in firebase
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }
            // Update name of the user in firestore
            const userRef = doc(db, 'users', auth.currentUser.uid)

            await setDoc(userRef, {name: name, email: email, timestamp: docSnap.data().timestamp})

        } catch (error) {
            toast.error("Could not update profile details..")
        }
    }

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button className="logOut" onClick={onLogOut}>Log Out</button>
            </header>
            
            <main>
                <div className="profileDetailsHeader">
                    <p className="personalDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={handleClick}>{changeDetails ? 'done' : "change"}</p>
                </div>

                <div className="profileCard">
                    <form>
                        <input type="text" className={changeDetails ? "profileNameActive" : "profileName"} disabled={!changeDetails} id='name' value={name} onChange={handleChange}/>
                        <input type="email" className={changeDetails ? "profileEmailActive" : "profileEmail"} disabled={!changeDetails} id='email' value={email} onChange={handleChange}/>
                    </form>
                </div>
            </main>
            <Link to='/create-listing' className="createListing">
                <img src={homeIcon} alt="home" />
                <p>Sell or Rent your home</p>
                <img src={arrowRight} alt="right arrow" />
            </Link>
        </div>
    );
 }

 export default Profile;