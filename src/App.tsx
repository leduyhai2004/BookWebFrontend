import React, { useState } from 'react';
import './App.css';
import NavBar from './layout/header-footer/NavBar';
import Footer from './layout/header-footer/Footer';
import HomePage from './layout/homepage/HomePage';


function App() {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className="App">
      <NavBar searchKey={searchKey} setSearchKey={setSearchKey}/>
      <HomePage searchKey={searchKey}/>
      <Footer/>
    </div>
  );
}

export default App;
