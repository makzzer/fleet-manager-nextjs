// hooks/useLoadGoogleMaps.ts
import { useEffect, useState } from "react";

export const useLoadGoogleMaps = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("google-maps")) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.id = "google-maps";
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else if (document.getElementById("google-maps")) {
      setIsLoaded(true);
    }
  }, [apiKey]);

  return isLoaded;
};
