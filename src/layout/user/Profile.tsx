"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

interface UserProfile {
  username: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  gender?: string
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      // Decode token to get basic user info
      const decodedToken = jwtDecode<any>(token)

      // Fetch user profile from API
      fetch(`http://localhost:8080/users/search/findByUsername?username=${decodedToken.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user profile")
          }
          return response.json()
        })
        .then((data) => {
          setProfile({
            username: decodedToken.sub,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
          })
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching profile:", err)
          setError("Failed to load profile. Please try again later.")
          setLoading(false)

          // Fallback to basic info from token
          setProfile({
            username: decodedToken.sub,
          })
        })
    } catch (err) {
      console.error("Error decoding token:", err)
      localStorage.removeItem("token")
      navigate("/login")
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">User Profile</h3>
            </div>
            <div className="card-body">
              {profile && (
                <div className="row">
                  <div className="col-md-4 text-center mb-4">
                    <div
                      className="avatar-placeholder bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                      style={{ width: "150px", height: "150px" }}
                    >
                      <i className="fa-solid fa-user fa-4x text-secondary"></i>
                    </div>
                    <h4 className="mt-3">{profile.username}</h4>
                  </div>
                  <div className="col-md-8">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Username:</th>
                          <td>{profile.username}</td>
                        </tr>
                        {profile.email && (
                          <tr>
                            <th>Email:</th>
                            <td>{profile.email}</td>
                          </tr>
                        )}
                        {profile.firstName && (
                          <tr>
                            <th>First Name:</th>
                            <td>{profile.firstName}</td>
                          </tr>
                        )}
                        {profile.lastName && (
                          <tr>
                            <th>Last Name:</th>
                            <td>{profile.lastName}</td>
                          </tr>
                        )}
                        {profile.phoneNumber && (
                          <tr>
                            <th>Phone Number:</th>
                            <td>{profile.phoneNumber}</td>
                          </tr>
                        )}
                        {profile.gender && (
                          <tr>
                            <th>Gender:</th>
                            <td>{profile.gender === "M" ? "Male" : "Female"}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="mt-3">
                      <button className="btn btn-primary me-2">Edit Profile</button>
                      <button className="btn btn-outline-secondary">Change Password</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow mt-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Order History</h3>
            </div>
            <div className="card-body">
              <p className="text-muted">You haven't placed any orders yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

