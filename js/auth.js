import api, { setAuthToken } from "./api.js";

export async function signIn(email, password_hash) {
    try {
        const response = await api.post("/admin/login", { email, password_hash });
    
        const token = response.data?.access_token;
        if (token) {
            try {
                localStorage.setItem("access_token", token);
                setAuthToken(token);
            } catch (error) {
                console.error("Error storing token:", error);
            }
        } else {
            console.error("Token not found in response:", response.data);
            throw new Error("Token not found in response");
        }

        return response.data;
    } catch (error) {
        console.error("Sign-in error:", error);
        throw error; // Re-throw the error to be handled in the calling function
    }
}

export const logout = () => {
    localStorage.removeItem("access_token");
    setAuthToken(null);
};
