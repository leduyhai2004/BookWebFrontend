import React, { useState } from 'react';
import './App.css';
import NavBar from './layout/header-footer/NavBar';
import Footer from './layout/header-footer/Footer';
import HomePage from './layout/homepage/HomePage';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import DetailBook from './layout/product/DetailBook';
import About from './layout/about/About';
import RegisterUser from './layout/user/RegisterUser';
import ActiveAccount from './layout/user/ActiveAccount';
import Login from './layout/user/Login';
import TestLogin from './layout/user/TestLogin';
import BookForm from './layout/admin/BookForm';
import BookForm_Admin from './layout/admin/BookForm';
import Error403 from './layout/error-page/403page';
import Profile from './layout/user/Profile';
import BookList_Admin from './layout/admin/BookList';
import BookUpdateForm_Admin from './layout/admin/BookUpdateForm';
import 'react-toastify/dist/ReactToastify.css';
import CartPage from './layout/cart/CartPage';
import FavoritesPage from './layout/favourites/FavouritesPage';



function App() {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className='App'>
    <BrowserRouter>
      <NavBar searchKey={searchKey} setSearchKey={setSearchKey}/>
      <Routes>
        <Route path='/' element={<HomePage searchKey={searchKey}/>}/>
        <Route path='/:type_id' element={<HomePage searchKey={searchKey}/>}/>
        <Route path='/books/:id' element={<DetailBook/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/register' element={<RegisterUser/>}/>
        <Route path='/active' element={<ActiveAccount/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/test' element={<TestLogin/>} />
        <Route path='/403-error' element={<Error403/>} />
        <Route path='/admin/book-form' element={<BookForm_Admin/>} />
        <Route path="/admin/books" element={<BookList_Admin />} />
        <Route path="/admin/book-form/:id" element={<BookUpdateForm_Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>


  );
}

export default App;
