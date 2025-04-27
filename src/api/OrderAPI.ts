import type { Order, OrderRequest, Payment, DeliveryMethod } from "../models/Order"

// Create a new order
export const createOrder = async (orderData: OrderRequest): Promise<Order | null> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    // Log the request payload for debugging
    console.log("Order request payload:", JSON.stringify(orderData))

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    // Check if the response is OK but don't try to parse it as JSON
    // This handles the case where the server returns a malformed JSON response
    if (response.ok) {
      try {
        // Try to parse the response as JSON, but don't fail if it's not valid
        const data = await response.json()
        return data
      } catch (parseError) {
        console.warn("Could not parse response as JSON, but the order was created successfully:", parseError)
        // Return null to indicate success but no valid response data
        return null
      }
    } else {
      const errorText = await response.text()
      console.error(`Failed to create order: ${response.status} ${errorText}`)
      throw new Error("Failed to create order")
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get all orders for the current user
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch("http://localhost:8080/api/orders/user/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch orders: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch orders")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

// Update the getPaymentMethods function to use the new endpoint
export const getPaymentMethods = async (): Promise<Payment[]> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch("http://localhost:8080/api/payments/names", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch payment methods: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch payment methods")
    }

    // Get the array of payment method names
    const paymentNames: string[] = await response.json()

    // Convert to Payment objects with auto-incrementing IDs
    const payments: Payment[] = paymentNames.map((name, index) => ({
      id: index + 1, // Auto-increment ID starting from 1
      nameOfPayment: name,
    }))

    return payments
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    throw error
  }
}

// Update the getDeliveryMethods function to use the new endpoint
export const getDeliveryMethods = async (): Promise<DeliveryMethod[]> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch("http://localhost:8080/api/delivery-methods/names", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch delivery methods: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch delivery methods")
    }

    // Get the array of delivery method names
    const deliveryNames: string[] = await response.json()

    // Convert to DeliveryMethod objects with auto-incrementing IDs
    const deliveryMethods: DeliveryMethod[] = deliveryNames.map((name, index) => ({
      id: index + 1, // Auto-increment ID starting from 1
      nameOfDeliveryMethod: name,
    }))

    return deliveryMethods
  } catch (error) {
    console.error("Error fetching delivery methods:", error)
    throw error
  }
}
