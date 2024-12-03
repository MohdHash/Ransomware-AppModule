import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decryptToken } from "./authUtils";
import {logout , clearSessionAndRedirect} from './authUtils';
const TargetCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the JWT token from the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    console.log(hashParams);
    for (const [key, value] of hashParams.entries()) {
      console.log(`${key}: ${value}`);
    }

    const idToken = hashParams.get("id_token");
    console.log(idToken);
    const refreshToken = hashParams.get("#refresh_token");

    if (idToken) {                                                                                                          
      // Store the encrypted token in a secure cookie
      sessionStorage.setItem("jwt", idToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      const token = decryptToken(idToken);

      const payload = JSON.parse(atob(token.split(".")[1]));

      sessionStorage.setItem("userName", payload.sub);

      // Clear the URL hash to remove the token from the URL
      window.history.replaceState(null, null, window.location.pathname);

      // Redirect to the main page of the target application
      navigate("/dashboard");
    } else {
      console.error("Error: Invalid token format or no token found in URL");
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default TargetCallbackHandler;
