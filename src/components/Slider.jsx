import { useState, useEffect } from "react";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate } from "react-router-dom";


const Slider = () => {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const q = query(collection(db, 'listings'), limit(5), orderBy('timestamp', 'desc'))

            const listingsSnap = await getDocs(q)

            const listingsClone = []

            listingsSnap.forEach((listing) => {
                return listingsClone.push({
                    id: listing.id,
                    data: listing.data()
                })
            })  
            
            setListings(listingsClone)
            setLoading(false)
        }

        fetchListings()
    }, [])

    if (loading) {
        return <Spinner />
    }
    else {
        return (
            <>
                <p className="exploreHeading">Recommended</p>

                <Swiper 
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    className='swiper-container'>
                        {listings.map((listing, index) => {
                            return <SwiperSlide key={index} onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}>
                                <div style={{background: `url(${listing.data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className='swiperSlideDiv'></div>
                                <p className="swiperSlideText">{listing.data.name}</p>
                                <p className="swiperSlidePrice">${listing.data.discountedPrice?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? listing.data.regularPrice.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{listing.data.type === 'rent' && ' / Month'}</p>
                            </SwiperSlide>
                        })}
                </Swiper>
            </>
        );
    }
}

export default Slider;