export const getAuthToken = () => {
    try {
        const storedToken = localStorage.getItem("authToken");

        // If no token is found, return null
        if (!storedToken) return null;

        // Check if the token is a valid JSON string
        try {
            const tokenObject = JSON.parse(storedToken);
            return tokenObject?.name || storedToken; // Return the 'name' property or the full token if it's a string
        } catch  {
            // If parsing fails, assume it's a plain token string
            return storedToken;
        }
    } catch (error) {
        console.error("Error retrieving auth token:", error);
        return null;
    }
};
