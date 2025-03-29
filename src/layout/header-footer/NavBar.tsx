import React, { ChangeEvent, useState } from "react";
import { House, Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

interface NavBarProps{
  searchKey : string;
  setSearchKey : (searchKey : string) => void; // kieu du lieu function
}

function NavBar({searchKey,setSearchKey} : NavBarProps){
  const [tuKhoaTamThoi,setTuKhoaTamThoi] = useState("");
  const onSearchInput=(e : ChangeEvent<HTMLInputElement>)=>{
    setTuKhoaTamThoi(e.target.value);
  }
  const handleSearch=()=>{
    setSearchKey(tuKhoaTamThoi);
  }
  const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();// The form will not submit and reload the page
      handleSearch();
    }
  };
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">HBooks</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Liên hệ</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Thể loại
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/1">Thể loại 1</Link></li>
                  <li><Link className="dropdown-item" to="/2">Thể loại 2</Link></li>
                  <li><Link className="dropdown-item" to="/3">Thể loại 3</Link></li>
                  <li><Link className="dropdown-item" to="/4">Thể loại 4</Link></li>
                  <li><Link className="dropdown-item" to="/5">Thể loại 5</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
              </li>
            </ul>

            
              <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={onSearchInput} value={tuKhoaTamThoi} onKeyDown={handleKeyDown} />
                  <button className="btn btn-outline-success me-3" type="button" onClick={handleSearch} >
                    <Search />
                  </button>
              </form>

              <ul className="navbar-nav me-1">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="fas fa-shopping-cart"></i>
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav me-1">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                  <i className="fa-solid fa-user"></i>
                  </a>
                </li>
              </ul>
          </div>
        </div>
    </nav>
    );
}
export default NavBar;