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
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>


  );
}

export default App;
