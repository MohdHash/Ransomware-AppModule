// authUtils.js
import PsiogEncryption from "psiog-crypt";
import axios from "axios";

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY; // Corrected to use the environment variable
const psiog = new PsiogEncryption(encryptionKey);

// Encrypt the token before storing
export function encryptToken(token) {
  try {
    return psiog.encrypt(token);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

// Decrypt the token
export function decryptToken(encryptedToken) {
  try {
    return psiog.decrypt(encryptedToken);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

// Check authorization and token expiration
export async function checkAuthorization() {
  const refreshToken = sessionStorage.getItem("refreshToken");

  // If no refresh token, log out
  if (!refreshToken) {
    console.warn("No refresh token found.");
    logout();
    return false;
  }

  const decryptedRefreshToken = decryptToken(refreshToken);

  // Validate refresh token
  const isValid = await validateRefreshToken(decryptedRefreshToken);

  if (!isValid) {
    console.warn("Unauthorized access - refresh token is invalid");
    logout();
    return false;
  }

  // If valid, refresh the session or retrieve a new token as needed here
  console.log("Refresh token is valid. Token can be refreshed.");
  return true;
}

// Validate refresh token via API
async function validateRefreshToken(refreshToken) {
  try {
    const response = await axios.post(
      "https://zseuci490j.execute-api.us-west-2.amazonaws.com/validate-refresh-token",
      { refreshToken }
    );

    const responseBody = JSON.parse(response.data.body);

    // Check if response indicates an invalid token
    if (responseBody.message === "invalidToken") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating refresh token:", error);
    return false;
  }
}

// Helper function to decode JWT and extract the "sub" field
function decodeJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
    return payload.sub; // Return the "sub" field (username)
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Logout function to clear tokens, call API, and redirect
export async function logout() {
  const encryptedToken = sessionStorage.getItem("jwt");
  if (!encryptedToken) {
    console.warn("No token found. Proceeding with logout.");
    clearSessionAndRedirect();
    return;
  }

  const token = decryptToken(encryptedToken); // Assuming you have a decryptToken function
  const username = decodeJwt(token); // Decode the JWT to get the "sub" field

  if (!username) {
    console.error("Failed to retrieve username from token.");
    clearSessionAndRedirect();
    return;
  }

  try {
    // Call the SignOut API
    const response = await axios.post(
      "https://er213hirqi.execute-api.us-west-2.amazonaws.com/SignOut",
      { username }
    );

    if (response.status === 200) {
      console.log("SignOut API called successfully.");
    } else {
      console.warn("SignOut API response status:", response.status);
    }
  } catch (error) {
    console.error("Error calling SignOut API:", error);
  }

  // Clear session and redirect to Cognito logout
  clearSessionAndRedirect();
}

// Helper function to clear session storage and redirect
export function clearSessionAndRedirect() {
  sessionStorage.clear();
  window.location.href =
    "https://digipo.auth.us-west-2.amazoncognito.com/logout?client_id=2mnv17voa7e8q6banlg0j0qth&logout_uri=https://digipo.impactors.link/"; // Replace with your actual sign-out URL
}
