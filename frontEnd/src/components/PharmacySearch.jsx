import { useCallback, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { GET_PHARMACY_LIST, HOST_URL } from "../constant";

const PharmacySearch = ({
  setPharmacies,
  pharmacies,
  handleSelectPharmacy,
  selectedPharmacy,
  address,
  handleChangeAddress,
}) => {
  const [loading, setLoading] = useState(false);
  const [isClickSearch, setIsClickSearch] = useState(false);

  // Haversine Formula: Calculate distance between two lat/lng points
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
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
  }

  async function getCoordinates(address, pharmacyInfo = {}) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json`;
    const response = await axios.get(url);
    if (!response.data.length) {
      toast.error("No pharmacies found near your location");
      setLoading(false);
      return;
    }
    return {
      address,
      lat: parseFloat(response.data[0].lat),
      lon: parseFloat(response.data[0].lon),
      pharmacyInfo,
    };
  }
  const getSortedAddresses = useCallback(async () => {
    if (!address) {
      toast.error("Please input address!");
      return;
    }

    setLoading(true);
    const res = await axios.get(GET_PHARMACY_LIST);
    try {
      if (res.status === 200) {
        const { pharmacyList } = res.data;

        const originCoords = await getCoordinates(address);
        const addressCoords = await Promise.all(
          pharmacyList.map(async (item) => {
            try {
              const { address, ...rest } = item;

              const [provinceRes, cityRes] = await Promise.all([
                axios.get(
                  `${HOST_URL}/prescription/province/${rest.province ?? ""}`
                ),
                axios.get(`${HOST_URL}/prescription/city/${rest.city ?? ""}`),
              ]);
              let cityName =
                cityRes.status === 200 ? cityRes.data.cityName.name : "";
              let provinceName =
                provinceRes.status === 200
                  ? provinceRes.data.provinceName.name
                  : "";
              console.log(cityName, provinceName, "city");
              const joinAddr = `${address} ${cityName} ${provinceName}`;
              console.log(joinAddr, "joinAddr");
              return getCoordinates(joinAddr, rest);
            } catch (error) {
              console.error("Error fetching city/province data:", error);
              return null;
            }
          })
        );
        const validAddresses = addressCoords.filter((addr) => addr !== null);
        setLoading(false);

        const sortedPharmacy = validAddresses
          .map((addr) => ({
            address: addr.address,
            distance: haversineDistance(
              originCoords.lat || '',
              originCoords.lon ||'',
              addr.lat,
              addr.lon
            ),
            ...addr.pharmacyInfo,
          }))
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        setPharmacies(sortedPharmacy);
        setIsClickSearch(true);
      } else {
        toast.error("Fetch pharmacy data failed!");
      }
    } catch (error) {
      console.error("Error fetching city/province data:", error);
      return null;
    }
  }, [address, setPharmacies]);

  return (
    <>
      <Box sx={{ p: 4, maxWidth: 500, mx: "auto", textAlign: "center" }}>
        <TextField
          fullWidth
          label="Enter Address (e.g., 31 Devitte Ave N)"
          variant="outlined"
          value={address}
          onChange={handleChangeAddress}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={getSortedAddresses}
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Search"}
        </Button>

        {/* Show Select Dropdown Only If Pharmacies Are Found */}
        {pharmacies.length > 0 && (
          <Select
            fullWidth
            displayEmpty
            sx={{ mt: 3 }}
            onChange={handleSelectPharmacy}
            value={selectedPharmacy}
            disabled={loading || !address}
          >
            <MenuItem disabled>Select a Pharmacy</MenuItem>
            {pharmacies.map((pharmacy, index) => (
              <MenuItem key={index} value={pharmacy._id}>
                {`${pharmacy.firstname} - ${pharmacy.distance}`}
              </MenuItem>
            ))}
          </Select>
        ) }
      </Box>
    </>
  );
};
PharmacySearch.propTypes = {
  setPharmacies: PropTypes.func,
  handleSelectPharmacy: PropTypes.func,
  pharmacies: PropTypes.arrayOf(PropTypes.object),
  selectedPharmacy: PropTypes.string,
  address: PropTypes.string,
  handleChangeAddress: PropTypes.func,
};
export default PharmacySearch;
