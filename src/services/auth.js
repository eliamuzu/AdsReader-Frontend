import api, { setAuthToken } from './api'

export async function signIn(email, password) {
  try {
    // API expects password_hash as field name, but we pass the plain password
    const response = await api.post("/admin/login", { email, password })
    const token = response.data?.access_token
    if (token) {
      try {
        localStorage.setItem("access_token", token)
        setAuthToken(token)
      } catch (error) {
        console.error("Error storing token:", error)
      }
    } else {
      console.error("Token not found in response:", response.data)
      throw new Error("Token not found in response")
    }

    return response.data
  } catch (error) {
    console.error("Sign-in error:", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("access_token")
  setAuthToken(null)
}

