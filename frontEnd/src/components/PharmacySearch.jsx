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
import { toast, ToastContainer } from "react-toastify";
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
      toast.error("Address not found");
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
    if (res.status === 200) {
      const { pharmacyList } = res.data;
// 50 Weber St N, Waterloo, Ontario N2J 3G7
      const originCoords = await getCoordinates(address);
      const addressCoords = await Promise.all(
        pharmacyList.map(async(item) => {
          const { address, ...rest } = item;
          let cityName='';
          let provinceName='';
          const provinceRes= await axios
          .get(`${HOST_URL}/prescription/province/${rest.province??''}`)
          const cityRes= await axios
          .get(`${HOST_URL}/prescription/city/${rest.city??''}`)
          if (cityRes.status === 200) {
            cityName=cityRes.data.cityName[0].name;
          }
          if (provinceRes.status === 200) {
            provinceName=provinceRes.data.provinceName[0].name;
          }
          console.log(cityName,provinceName,'city')
          const joinAddr=`${address} ${cityName} ${provinceName}`
          console.log(joinAddr,'joinAddr')
          return getCoordinates(address, rest);
        })
      );

      setLoading(false);

      const sortedPharmacy = addressCoords
        .map((addr) => ({
          address: addr.address,
          distance: haversineDistance(
            originCoords.lat,
            originCoords.lon,
            addr.lat,
            addr.lon
          ),
          ...addr.pharmacyInfo,
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      setPharmacies(sortedPharmacy);
    } else {
      toast.error("Fetch pharmacy data failed!");
    }
  }, [address, setPharmacies]);

  return (
    <>
      <ToastContainer />
      <Box sx={{ p: 4, maxWidth: 500, mx: "auto", textAlign: "center" }}>
        {/* <Typography variant="h5" gutterBottom>
        Pharmacy Finder
      </Typography> */}

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
        >
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
          <Select
            fullWidth
            displayEmpty
            sx={{ mt: 3 }}
            onChange={handleSelectPharmacy}
            value={selectedPharmacy}
            disabled={loading}
          >
            <MenuItem disabled>Select a Pharmacy</MenuItem>
            {pharmacies.map((pharmacy, index) => (
              <MenuItem key={index} value={pharmacy._id}>
                {`${pharmacy.firstname} - ${pharmacy.distance}`}
              </MenuItem>
            ))}
          </Select>
        )}
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
