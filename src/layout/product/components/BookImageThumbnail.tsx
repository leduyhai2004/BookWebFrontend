"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getOneImageOfABook } from "../../../api/ImageAPI"
import type Image from "../../../models/Image"

interface BookImageProps {
  bookId: number
  width?: string
  height?: string
  className?: string
}

const BookImage: React.FC<BookImageProps> = ({ bookId, width = "100%", height = "auto", className = "" }) => {
  const [image, setImage] = useState<Image | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const images = await getOneImageOfABook(bookId)
        if (images && images.length > 0) {
          setImage(images[0])
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching book image:", err)
        setError("Failed to load image")
        setLoading(false)
      }
    }

    fetchImage()
  }, [bookId])

  if (loading) {
    return (
      <div className="placeholder-glow" style={{ width, height }}>
        <span className="placeholder col-12 h-100"></span>
      </div>
    )
  }

  if (error || !image || !image.dataImage) {
    return (
      <img
        src="/placeholder.svg"
        alt="Book cover not available"
        className={`img-thumbnail ${className}`}
        style={{ width, height, objectFit: "cover" }}
      />
    )
  }

  return (
    <img
      src={image.dataImage || "/placeholder.svg"}
      alt="Book cover"
      className={`img-thumbnail ${className}`}
      style={{ width, height, objectFit: "cover" }}
    />
  )
}

export default BookImage

