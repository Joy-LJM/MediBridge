import  { useState } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress, Select, MenuItem, Box } from "@mui/material";
import PropTypes from "prop-types";

const PharmacySearch = ({setPharmacies,pharmacies,handleSelectPharmacy,selectedPharmacy}) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Haversine Formula: Calculate distance between two lat/lng points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2) + " km";
  };

  const findPharmacies = async () => {
    if (!address) return;

    setLoading(true); // Show loading spinner

    try {
      // Split address into street & postal code (for better accuracy)
      const parts = address.split(",");
      const street = parts[0]?.trim() || "";
      const postalcode = parts[1]?.trim() || "";

      // 1. Convert Address to Lat/Lng using Nominatim API (Fixed Query)
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(street)}&postalcode=${encodeURIComponent(postalcode)}&country=Canada`
      );
      if (!geoResponse.data.length) {
        alert("Address not found");
        setLoading(false);
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      // 2. Search for Nearby Pharmacies using Overpass API
      const overpassQuery = `
        [out:json];
        node(around:5000,${lat},${lon})["amenity"="pharmacy"];
        out;
      `;
      const overpassResponse = await axios.get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
      );

      if (!overpassResponse.data.elements.length) {
        alert("No pharmacies found");
        setLoading(false);
        return;
      }

      // 3. Calculate Distances and Set Data
      const formattedPharmacies = overpassResponse.data.elements.map((place) => ({
        name: place.tags.name || "Unknown Pharmacy",
        distance: calculateDistance(lat, lon, place.lat, place.lon),
      }));
      formattedPharmacies.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      setPharmacies(formattedPharmacies);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto", textAlign: "center" }}>
      {/* <Typography variant="h5" gutterBottom>
        Pharmacy Finder
      </Typography> */}

      <TextField
        fullWidth
        label="Enter Address (e.g., 31 Devitte Ave N)"
        variant="outlined"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ mb: 2 }}
      
      />

      <Button variant="contained" color="primary" onClick={findPharmacies} fullWidth>
        Search
      </Button>

      {/* Show Loading Spinner When Searching */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show Select Dropdown Only If Pharmacies Are Found */}
      {pharmacies.length > 0 && (
        <Select fullWidth displayEmpty sx={{ mt: 3 }} onChange={handleSelectPharmacy} value={selectedPharmacy}>
          <MenuItem disabled>Select a Pharmacy</MenuItem>
          {pharmacies.map((pharmacy, index) => (
            <MenuItem key={index} value={pharmacy.name}>
              {`${pharmacy.name} - ${pharmacy.distance}`}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );
};
PharmacySearch.propTypes={
  setPharmacies:PropTypes.func,
  handleSelectPharmacy:PropTypes.func,
  pharmacies:PropTypes.arrayOf(PropTypes.object),
  selectedPharmacy:PropTypes.string,
}
export default PharmacySearch;
