import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore"; 
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Profile = () => {

    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const [userListings, setUserListings] = useState(null)

    const [loading, setLoading] = useState(false)

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

    useEffect(() => {
        const fetchUserListings = async () => {
            const q = query(collection(db, 'listings'), where('userRef', '==', auth.currentUser.uid))

            const querySnap = await getDocs(q)

            const userListingsClone = []

            querySnap.forEach((listing) => {
                userListingsClone.push({
                    id: listing.id,
                    data: listing.data()
                })
            })
            setUserListings(userListingsClone)

        }

        fetchUserListings()
    }, [])

    const onDelete = async (listingId) => {
        setLoading(true)
        if (window.confirm("Are you sure you want to delete?")) {
            try {
                await deleteDoc(doc(db, 'listings', listingId))
                const updatedListings = userListings.filter((listing) => {
                    return listing.id !== listingId
                })
                setUserListings(updatedListings)
                setLoading(false)
                toast.success("Listing successfully removed!")
            } catch (error) {
                toast.error("Listing could not be deleted!")
            }
        }
        
    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`)
    }

    if (userListings === null) {
        return (
            <Spinner />
        );
    }

    if (loading) {
        return <Spinner />
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

            <br />
            <br />
            <br />

            {userListings?.map((listing) => {
                return (
                    <ListingItem key={listing.id} id={listing.id} listing={listing.data} onDelete={onDelete} onEdit={onEdit}/>
                );
            })}

        </div>
    );
 }

 export default Profile;