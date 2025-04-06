"use client"

import type React from "react"
import { type ChangeEvent, useEffect, useState } from "react"
import { Search } from "react-bootstrap-icons"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

interface NavBarProps {
  searchKey: string
  setSearchKey: (searchKey: string) => void // kieu du lieu function
}

function NavBar({ searchKey, setSearchKey }: NavBarProps) {
  const [tuKhoaTamThoi, setTuKhoaTamThoi] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartItems, setCartItems] = useState<number>(0)
  const [favoritesItems, setFavoritesItems] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = jwtDecode<any>(token)
        console.log(decodedToken)
        setIsLoggedIn(true)
        setUsername(decodedToken.sub)
        setIsAdmin(decodedToken.isAdmin || false)

        // Get cart items count
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        setCartItems(cart.length)

        // Get favorites count
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setFavoritesItems(favorites.length)
      } catch (error) {
        console.error("Invalid token", error)
        localStorage.removeItem("token")
        setIsLoggedIn(false)
      }
    }
  }, [])

  // Listen for storage events to update cart and favorites count
  useEffect(() => {
    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartItems(cart.length)

      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      setFavoritesItems(favorites.length)
    }

    window.addEventListener("storage", handleStorageChange)
    // Custom event for our app
    window.addEventListener("cartUpdated", handleStorageChange)
    window.addEventListener("favoritesUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleStorageChange)
      window.removeEventListener("favoritesUpdated", handleStorageChange)
    }
  }, [])

  const onSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTuKhoaTamThoi(e.target.value)
  }

  const handleSearch = () => {
    setSearchKey(tuKhoaTamThoi)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // The form will not submit and reload the page
      handleSearch()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setUsername(null)
    setIsAdmin(false)
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          HBooks
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Liên hệ
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Thể loại
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/1">
                    Thể loại 1
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/2">
                    Thể loại 2
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/3">
                    Thể loại 3
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/4">
                    Thể loại 4
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/5">
                    Thể loại 5
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
            {isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin Panel
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin/books">
                      Manage Books
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/book-form">
                      Add New Book
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Tìm kiếm"
              aria-label="Search"
              onChange={onSearchInput}
              value={tuKhoaTamThoi}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-outline-success me-3" type="button" onClick={handleSearch}>
              <Search />
            </button>
          </form>

          <ul className="navbar-nav me-1">
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link position-relative"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-shopping-cart"></i>
                {cartItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems}
                  </span>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/cart">
                    View Cart
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/checkout">
                    Checkout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav me-1">
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link position-relative"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-heart"></i>
                {favoritesItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {favoritesItems}
                  </span>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/favorites">
                    View Favorites
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav me-1">
            <li className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-user"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {isLoggedIn ? (
                  <>
                    <li>
                      <span className="dropdown-item-text">Hello, {username}</span>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
export default NavBar

