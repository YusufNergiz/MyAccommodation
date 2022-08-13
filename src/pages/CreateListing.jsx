import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {db} from '../firebase.config'
import { async, uuidv4 } from "@firebase/util";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"; 


const CreateListing = () => {

    const [listingData, setListingData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude} = listingData

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const auth = getAuth()
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setListingData({...listingData, userRef: user.uid })
                }
                else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }

    }, [isMounted])


    const onMutate = (e) => {
        e.preventDefault()

        let boolean = null;

        try {

            if (e.target.files) {
                setListingData(prevListing => (
                    {
                        ...prevListing,
                        images: e.target.files
                    }
                ))
            }
            if (e.target.value === 'true') {
                boolean = true
            }
            if (e.target.value === 'false') {
                boolean = false
            }

            if (!e.target.files) {
                setListingData(prevListing => (
                    {
                        ...prevListing,
                        [e.target.id]: boolean !== null ? boolean : e.target.value
                    }
                ))
            }

        } catch (error) {
            toast.error("Oops something went wrong!")
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)


        if (discountedPrice > regularPrice) {
            toast.error("Discounted price should be less than the Regular price!")
            setLoading(false)
            return
        }
        if (images.length > 6) {
            toast.error("Maximum amout of Image upload is 6!")
            setLoading(false)
            return
        }

        let geolocation = {}
        let exactAddress;

        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODING_API_KEY}`)
        const data = await response.json()

        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0   
        exactAddress = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address
        setLoading(false)
        if (exactAddress === undefined || exactAddress.includes('undefined')) {
            setLoading(false)
            toast.error('Please enter a valid address!')
            return
        }
        
        setListingData(prevListing => (
            {
                ...prevListing,
                latitude: geolocation.lat,
                longitude: geolocation.lng
            }
        ))

        const uplaodImage = async (image) => {
          setLoading(true)
          return new Promise((resolve, reject) => {
            const storage = getStorage()

            const metadata = {
              contentType: 'image/jpeg'
            };

            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

            const storageRef = ref(storage, 'images/' + fileName)

            const uploadTask = uploadBytesResumable(storageRef, image, metadata)

            uploadTask.on('state_changed',
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused');
                    break;
                  case 'running':
                    console.log('Upload is running');
                    break;
                }
              }, 
              (error) => {
                reject(error)
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                  case 'storage/canceled':
                    // User canceled the upload
                    break;

                  // ...

                  case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
              }, 
              () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL)
                });
              }
            );
          })
        }

        const imgUrls = await Promise.all(
          [...images].map((image) => uplaodImage(image))
        ).catch(() => {
          setLoading(false)
          toast.error("Could not upload Image")
          return
        })

        
        const listingDataClone = {
          ...listingData,
          geolocation: geolocation,
          imageUrls: imgUrls,
          timestamp: serverTimestamp()
        }


        listingDataClone.location = address
        delete listingDataClone.images
        !listingDataClone.offer && delete listingDataClone.discountedPrice


        const docRef = await addDoc(collection(db, 'listings'), listingDataClone)
        setLoading(false)
        toast.success("Listing saved")
        navigate(`/category/${listingDataClone.type}/${docRef.id}`)
    }

    if (loading) {
        return <Spinner />
    }


    return (
        <div className='profile'>
      <header>
        <p className='pageHeader'>Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6), only jpeg format is allowed.
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing;