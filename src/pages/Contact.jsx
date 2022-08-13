import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore"; 
import { db } from "../firebase.config";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";


const Contact = () => {

    const [landlord, setLandlord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setLandlord(docSnap.data())
            }
            else {
                toast.error("The listing owner does not exist!")
            }
            setLoading(false)
        }

        getLandlord()
    }, [])

    const onChange = (e) => {
        setMessage(e.target.value)
    }
    
    if (loading) {
        return <Spinner />
    }

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Contact Landlord</p>
            </header>

            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contact {landlord?.name}</p>
                    </div>

                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">Message</label>
                            <textarea name="message" id="message" className="textarea" value={message} onChange={onChange}></textarea>
                        </div>
                    </form>
                    <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`} className='primaryButton'>Send Message</a>
                </main>
            )}
        </div>
    );
}

export default Contact;