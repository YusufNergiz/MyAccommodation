 
 import { Link } from "react-router-dom";
 import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
 import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import Slider from "../components/Slider";

 
 const Explore = () => {
    return (
        <div className="explore">
            <header>
                <p className="pageHeader">Explore</p>
            </header>

            <main>
                <Slider />
                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to='/category/rent'>
                        <img src={rentCategoryImage} alt="Rent Catgory Image" className="exploreCategoryImg"/>
                        <p className="exploreCategoryName">Places for Rent</p>
                    </Link>
                    <Link to='/category/sale'>
                        <img src={sellCategoryImage} alt="Sell Category Image" className="exploreCategoryImg"/>
                        <p className="exploreCategoryName">Places for Sale</p>
                    </Link>
                </div>
            </main>
        </div>
    );
 }

 export default Explore;