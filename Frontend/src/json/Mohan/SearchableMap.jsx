import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const SearchableUserMap = ({
  lat,
  lng,
  onLocationChange,
  readOnly = false,
}) => {
  const [position, setPosition] = useState([
    lat ? Number(lat) : 10.360861781583349,
    lng ? Number(lng) : 77.98021272646892,
  ]);
  const [query, setQuery] = useState("");

  const reverseGeocode = async (lat, lng) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
    );
    const data = await res.json();

    const address = data.address || {};

    return {
      city: address.city || address.town || address.village || "",
      street: address.road || address.suburb || "",
      zipcode: address.postcode || "",
    };
  };

  const handleSearch = async () => {
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
    );
    const data = await res.json();
    if (!data.length) return;

    const newLat = data[0].lat;
    const newLng = data[0].lon;

    setPosition([Number(newLat), Number(newLng)]);

    const address = await reverseGeocode(newLat, newLng);

    onLocationChange({
      lat: newLat,
      lng: newLng,
      city: address.city,
      street: address.street,
      zipcode: address.zipcode,
    });
  };

  const ChangeMapView = ({ center }) => {
    const map = useMap();

    useEffect(() => {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }, [center, map]);

    return null;
  };

  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or street"
            className="flex-1 border p-2 rounded"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 bg-emerald-600 text-white rounded"
          >
            Search
          </button>
        </div>
      )}
      <div className="h-64 w-full rounded-lg overflow-hidden border">
        <MapContainer center={position} zoom={13} className="h-full w-full">
          <ChangeMapView center={position} />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={position}
            draggable={!readOnly}
            eventHandlers={
              readOnly
                ? {}
                : {
                    dragend: async (e) => {
                      const pos = e.target.getLatLng();
                      setPosition([pos.lat, pos.lng]);

                      const address = await reverseGeocode(pos.lat, pos.lng);

                      onLocationChange({
                        lat: pos.lat,
                        lng: pos.lng,
                        city: address.city,
                        street: address.street,
                        zipcode: address.zipcode,
                      });
                    },
                  }
            }
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default SearchableUserMap;
