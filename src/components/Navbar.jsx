import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/svg/personOutlineIcon.svg";
import { ReactComponent as EXploreIcon } from "../assets/svg/exploreIcon.svg";

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const isCurrentPath = (path) => {
        if (path === location.pathname) {
            return true
        }
        else {
            return false
        }
    }

    return (
        <footer className="navbar">
            <nav className="navbarNav">
                <ul className='navbarListItems'>
                    <li className="navbarListItem"><EXploreIcon width={36} height={36} fill={isCurrentPath('/') ? '#2c2c2c' : '#8f8f8f'} onClick={() => navigate('/')}/><p className={isCurrentPath('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p></li>
                    <li className="navbarListItem"><OfferIcon width={36} height={36} fill={isCurrentPath('/offers') ? '#2c2c2c' : '#8f8f8f'} onClick={() => navigate('/offers')}/><p className={isCurrentPath('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p></li>
                    <li className="navbarListItem"><ProfileIcon width={36} height={36} fill={isCurrentPath('/profile') ? '#2c2c2c' : '#8f8f8f'} onClick={() => navigate('/profile')}/><p className={isCurrentPath('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p></li>
                </ul>
            </nav>
        </footer>
    );
}

export default Navbar;