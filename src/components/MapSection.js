// src/components/MapSection.jsx
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMale, FaCar } from 'react-icons/fa'; // Import person and police car icons
import ReactDOMServer from 'react-dom/server';

const MapSection = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
//upon rendering the component the location of the user is fetched ,
//and the longitude and latitude is updated accordingly
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentLocation({ lat: 51.505, lng: -0.09 }); // Default location if geolocation fails
        }
      );
    } else {
      setCurrentLocation({ lat: 51.505, lng: -0.09 });
    }
  }, []);

  useEffect(() => {
    if (currentLocation && mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize the map only once
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: true,
        preferCanvas: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Define custom icons using ReactDOMServer for current location and police stations
      const currentLocationIcon = L.divIcon({
        html: ReactDOMServer.renderToString(<FaMale style={{ color: 'green', fontSize: '24px' }} />),
        className: '', // Remove default styling
      });

      const policeStationIcon = L.divIcon({
        html: ReactDOMServer.renderToString(<FaCar style={{ color: 'blue', fontSize: '24px' }} />),
        className: '', // Remove default styling
      });

      // Add marker for the current location with person icon
      L.marker([currentLocation.lat, currentLocation.lng], { icon: currentLocationIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('You are here!')
        .openPopup();

      // Generate random police station locations nearby
      const generateNearbyLocations = (lat, lng, count = 5) => {
        const locations = [];
        for (let i = 0; i < count; i++) {
          const randomLat = lat + (Math.random() - 0.5) * 0.02;
          const randomLng = lng + (Math.random() - 0.5) * 0.02;
          locations.push({
            lat: randomLat,
            lng: randomLng,
            name: `Police Station ${i + 1}`,
          });
        }
        return locations;
      };

      // Example data for nearby police stations
      const policeStations = generateNearbyLocations(currentLocation.lat, currentLocation.lng);

      // Add markers for each police station with police car icon
      policeStations.forEach((station) => {
        L.marker([station.lat, station.lng], { icon: policeStationIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(station.name);
      });

      // Fix any map size issues when loading
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove(); // Clean up map instance on unmount
      }
    };
  }, [currentLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-96 rounded-lg shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapSection;
