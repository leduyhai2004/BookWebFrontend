import type { Order, OrderRequest, Payment, DeliveryMethod } from "../models/Order"
import { PaymentStatus, DeliveryStatus } from "../models/Order"

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

// Get all orders for admin
export const getAdminOrders = async (): Promise<Order[]> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch("http://localhost:8080/api/orders/admin/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch admin orders: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch admin orders")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching admin orders:", error)
    throw error
  }
}

// Get a single order by ID
export const getOrderById = async (orderId: number): Promise<Order> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch order: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch order")
    }

    // Try to parse the response as JSON, but handle potential parsing errors
    try {
      return await response.json()
    } catch (parseError) {
      console.error(`Error parsing order JSON: ${parseError}`)

      // If we can't parse the JSON due to nesting depth issues, try to fetch a simplified version
      // or construct a minimal order object with the available information
      return {
        id: orderId,
        addressOfBuyer: "Unable to load full address",
        price: 0,
        paymentId: 0,
        deliveryMethodId: 0,
        items: [],
        paymentStatus: PaymentStatus.PENDING,
        deliveryStatus: DeliveryStatus.PENDING,
      }
    }
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error)
    throw error
  }
}

// Update order as admin
export const updateOrderAsAdmin = async (
  orderId: number,
  deliveryStatus: string,
  paymentStatus: string,
  addressOfBuyer: string,
): Promise<Order> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const url = `http://localhost:8080/api/orders/admin/${orderId}?deliveryStatus=${encodeURIComponent(
      deliveryStatus,
    )}&paymentStatus=${encodeURIComponent(paymentStatus)}&addressOfBuyer=${encodeURIComponent(addressOfBuyer)}`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to update order: ${response.status} ${errorText}`)
      throw new Error("Failed to update order")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating order with ID ${orderId}:`, error)
    throw error
  }
}

// Update order address as user
export const updateOrderAddressAsUser = async (orderId: number, addressOfBuyer: string): Promise<Order> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const url = `http://localhost:8080/api/orders/user/${orderId}?addressOfBuyer=${encodeURIComponent(addressOfBuyer)}`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to update order address: ${response.status} ${errorText}`)
      throw new Error("Failed to update order address")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating order address with ID ${orderId}:`, error)
    throw error
  }
}

// Delete order
export const deleteOrder = async (orderId: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to delete order: ${response.status} ${errorText}`)
      throw new Error("Failed to delete order")
    }

    return true
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error)
    throw error
  }
}

// Get payment method details by ID
export const getPaymentMethodById = async (paymentId: number): Promise<Payment> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`http://localhost:8080/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch payment method: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch payment method")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching payment method with ID ${paymentId}:`, error)
    // Return a default payment object if the fetch fails
    return { id: paymentId, nameOfPayment: "Unknown payment method" }
  }
}

// Get delivery method details by ID
export const getDeliveryMethodById = async (deliveryMethodId: number): Promise<DeliveryMethod> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`http://localhost:8080/delivery-methods/${deliveryMethodId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch delivery method: ${response.status} ${errorText}`)
      throw new Error("Failed to fetch delivery method")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching delivery method with ID ${deliveryMethodId}:`, error)
    // Return a default delivery method object if the fetch fails
    return { id: deliveryMethodId, nameOfDeliveryMethod: "Unknown delivery method" }
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
