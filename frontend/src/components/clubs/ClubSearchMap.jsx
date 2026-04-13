import { useEffect, useRef, useState } from "react";

let googleMapsPromise;

function loadGoogleMapsApi(apiKey) {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = "__gymentalityGoogleMapsInit";

    window[callbackName] = () => {
      if (window.google?.maps) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps API loaded without google.maps."));
      }
      delete window[callbackName];
    };

    const existingScript = document.getElementById("gymentality-google-maps");

    if (existingScript) {
      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Google Maps API."));
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "gymentality-google-maps";
    script.src =
      `https://maps.googleapis.com/maps/api/js?` +
      `key=${apiKey}&loading=async&callback=${callbackName}&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps API."));
      delete window[callbackName];
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function getMarkerIcon(isSelected) {
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: isSelected ? 11 : 8,
    fillColor: isSelected ? "#FFC300" : "#111111",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: isSelected ? 2 : 1.5,
  };
}

export default function ClubSearchMap({
  apiKey,
  clubs,
  selectedClubId,
  defaultCenter,
  defaultZoom,
  onClubSelect,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!apiKey || !mapRef.current) {
      return;
    }

    let isMounted = true;

    loadGoogleMapsApi(apiKey)
      .then(() => {
        if (!isMounted || mapInstanceRef.current || !window.google?.maps) {
          return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: false,
          mapTypeControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
        });

        mapInstanceRef.current = map;

        const bounds = new window.google.maps.LatLngBounds();

        clubs.forEach((club) => {
          const marker = new window.google.maps.Marker({
            position: club.coordinates,
            map,
            title: club.name,
            icon: getMarkerIcon(String(club.id) === String(selectedClubId)),
          });

          marker.addListener("click", () => {
            onClubSelect(club.id);
          });

          markersRef.current.set(club.id, marker);
          bounds.extend(club.coordinates);
        });

        if (!selectedClubId && clubs.length) {
          map.fitBounds(bounds, 80);
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setLoadError("Google Maps could not be loaded.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, clubs, defaultCenter, defaultZoom, onClubSelect, selectedClubId]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map || !window.google?.maps) {
      return;
    }

    markersRef.current.forEach((marker, clubId) => {
      marker.setIcon(getMarkerIcon(String(clubId) === String(selectedClubId)));
      marker.setZIndex(String(clubId) === String(selectedClubId) ? 2 : 1);
    });

    if (!selectedClubId) {
      const bounds = new window.google.maps.LatLngBounds();
      clubs.forEach((club) => bounds.extend(club.coordinates));
      map.fitBounds(bounds, 80);
      return;
    }

    const selectedClub = clubs.find(
      (club) => String(club.id) === String(selectedClubId)
    );

    if (selectedClub) {
      map.panTo(selectedClub.coordinates);
      map.setZoom(16);
    }
  }, [clubs, selectedClubId]);

  if (!apiKey) {
    return (
      <div className="clubs-page__map-fallback">
        Add <strong>VITE_GOOGLE_MAPS_API_KEY</strong> to your <code>.env.local</code>
      </div>
    );
  }

  if (loadError) {
    return <div className="clubs-page__map-fallback">{loadError}</div>;
  }

  return <div ref={mapRef} className="clubs-page__map-canvas" />;
}