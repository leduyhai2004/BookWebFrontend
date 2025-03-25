import React from 'react';
import './App.css';
import NavBar from './layout/header-footer/NavBar';
import Footer from './layout/header-footer/Footer';
import HomePage from './layout/homepage/HomePage';
import { getAllBooks } from './api/BookAPI';

function App() {
  // getAllBooks().then().catch();
  return (
    <div className="App">
      <NavBar/>
      <HomePage/>
      <Footer/>
    </div>
  );
}

export default App;
