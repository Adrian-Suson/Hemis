import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../utils/config'; // Adjust path to match your project structure

const useLocationData = () => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const [regionsResponse, provincesResponse, municipalitiesResponse] = await Promise.all([
        axios.get(`${config.API_URL}/regions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${config.API_URL}/provinces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${config.API_URL}/municipalities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Validate response data
      const validateData = (data, type) => {
        if (!Array.isArray(data)) {
          console.warn(`Invalid ${type} data received:`, data);
          return [];
        }
        return data;
      };

      setRegions(validateData(regionsResponse.data, 'regions'));
      setProvinces(validateData(provincesResponse.data, 'provinces'));
      setMunicipalities(validateData(municipalitiesResponse.data, 'municipalities'));

      console.log('Location data fetched successfully:', {
        regions: regionsResponse.data,
        provinces: provincesResponse.data,
        municipalities: municipalitiesResponse.data,
      });
    } catch (err) {
      console.error('Error fetching location data:', err);
      let errorMessage = 'Failed to fetch location data. Please try again.';
      if (err.response && err.response.status === 401) {
        errorMessage = 'Unauthorized: Please log in again.';
      } else if (err.response && err.response.status === 404) {
        errorMessage = 'Location API endpoints not found.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  // Memoize the getMunicipalityPostalCode function
  const getMunicipalityPostalCode = useCallback((municipalityName) => {
    if (!municipalityName || !Array.isArray(municipalities)) return '';
    const municipality = municipalities.find(m => m.name === municipalityName);
    return municipality ? municipality.postal_code : '';
  }, [municipalities]); // Only depends on municipalities array

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only depends on the memoized fetchData function

  return {
    regions,
    provinces,
    municipalities,
    loading,
    error,
    getMunicipalityPostalCode,
    refreshData: fetchData // Expose the fetch function for manual refresh
  };
};

export default useLocationData;
