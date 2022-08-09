import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPasswod';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Categories from './pages/Categories';
import CreateListing from './pages/CreateListing';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Explore />}/>
          <Route path='/offers' element={<Offers />}/>
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
          <Route path='/category/:categoryName' element={<Categories />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/create-listing' element={<CreateListing />}/>
        </Routes>
        <Navbar />
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
}

export default App;
