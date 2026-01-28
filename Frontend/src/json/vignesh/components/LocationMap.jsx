import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

const LocationMap = ({ lat, lng, onChange }) => {
  const position = [Number(lat), Number(lng)];

  const DraggableMarker = () => {
    const map = useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });

    return (
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            onChange(lat, lng);
          },
        }}
      >
        <Popup>
          Lat: {lat} <br />
          Lng: {lng}
        </Popup>
      </Marker>
    );
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DraggableMarker />
    </MapContainer>
  );
};

export default LocationMap;
