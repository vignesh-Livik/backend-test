const geocodeAddress = async (address) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address,
        )}&limit=1`,
    );
    const data = await res.json();
    if (!data.length) return null;

    return {
        lat: data[0].lat,
        lng: data[0].lon,
    };
};
export default geocodeAddress