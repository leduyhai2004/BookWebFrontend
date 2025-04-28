"use client"

import { useState } from "react"
import "./App.css"
import NavBar from "./layout/header-footer/NavBar"
import Footer from "./layout/header-footer/Footer"
import HomePage from "./layout/homepage/HomePage"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import DetailBook from "./layout/product/DetailBook"
import About from "./layout/about/About"
import RegisterUser from "./layout/user/RegisterUser"
import ActiveAccount from "./layout/user/ActiveAccount"
import Login from "./layout/user/Login"
import TestLogin from "./layout/user/TestLogin"
import BookForm_Admin from "./layout/admin/BookForm"
import Error403 from "./layout/error-page/403page"
import Profile from "./layout/user/Profile"
import BookList_Admin from "./layout/admin/BookList"
import BookUpdateForm_Admin from "./layout/admin/BookUpdateForm"
import "react-toastify/dist/ReactToastify.css"
import CartPage from "./layout/cart/CartPage"
import FavoritesPage from "./layout/favourites/FavouritesPage"
import CheckoutPage from "./layout/checkout/CheckoutPage"
import OrdersPage from "./layout/orders/OrdersPage"
import UserOrderEditPage from "./layout/orders/UserOrderEditPage"
import AdminOrdersPage_Admin from "./layout/admin/orders/AdminOrdersPage"
import AdminOrderEditPage_Admin from "./layout/admin/orders/AdminOrderEditPage"
import { ToastContainer } from "react-toastify"

function App() {
  const [searchKey, setSearchKey] = useState("")

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar searchKey={searchKey} setSearchKey={setSearchKey} />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<HomePage searchKey={searchKey} />} />
          <Route path="/:type_id" element={<HomePage searchKey={searchKey} />} />
          <Route path="/books/:id" element={<DetailBook />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/active" element={<ActiveAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<TestLogin />} />
          <Route path="/403-error" element={<Error403 />} />
          <Route path="/admin/book-form" element={<BookForm_Admin />} />
          <Route path="/admin/books" element={<BookList_Admin />} />
          <Route path="/admin/book-form/:id" element={<BookUpdateForm_Admin />} />
          <Route path="/admin/orders" element={<AdminOrdersPage_Admin />} />
          <Route path="/admin/orders/edit/:id" element={<AdminOrderEditPage_Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/edit/:id" element={<UserOrderEditPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
