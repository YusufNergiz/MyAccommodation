import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {

    const { categoryName } = useParams()

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastListing, setLastListing] = useState(null)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const q = query(collection(db, 'listings'), where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10));

                const dummyListings = [];

                const querySnap = await getDocs(q);

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastListing(lastVisible)

                querySnap.forEach(listing => { dummyListings.push({
                    data: listing.data(),
                    id: listing.id
                }) });
                setLoading(false)
                setListings(dummyListings)
            } catch (error) {
                toast.error("Could not Fetch Offers!")
            }
        } 

        fetchListing()
    }, []) 
    
    const loadMore = async () => {
        try {
            const q = query(collection(db, 'listings'), where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10), startAfter(lastListing))

            const dummyListing = []

            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]

            setLastListing(lastVisible)

            querySnap.forEach(listing => {
                dummyListing.push({
                    id: listing.id,
                    data: listing.data()
                })
            })

            setListings(prevListings => [...prevListings, ...dummyListing])
        } catch (error) {
            toast.info("No more listings available")
        }
    }

    return (
        <div className="category">
            <header>
                <p className="pageHeader">Latest Offers</p>
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => {
                                return <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                            })}
                        </ul>
                        <p className="loadMore" onClick={loadMore}>Load More</p>
                    </main>
                </>
            ): <h3>There are no any offers</h3>}
        </div>
    );
}

export default Offers;