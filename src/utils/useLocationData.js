import { useState, useCallback } from "react";
import axios from "axios";
import config from "./config";

const useLocationData = () => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);

    const fetchRegions = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${config.API_URL}/regions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRegions(res.data);
        } catch {
            setRegions([]);
        }
    }, []);

    const fetchProvinces = useCallback(async (regionId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${config.API_URL}/provinces?region_id=${regionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setProvinces(res.data);
        } catch {
            setProvinces([]);
        }
    }, []);

    const fetchMunicipalities = useCallback(async (provinceId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${config.API_URL}/municipalities?province_id=${provinceId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMunicipalities(res.data);
        } catch {
            setMunicipalities([]);
        }
    }, []);

    const fetchMunicipalitiesByRegion = useCallback(async (regionId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${config.API_URL}/municipalities?region_id=${regionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMunicipalities(res.data);
        } catch {
            setMunicipalities([]);
        }
    }, []);

    const getLocationById = useCallback(
        async (regionId, provinceId, municipalityId) => {
            try {
                const token = localStorage.getItem("token");

                const [regionRes, provinceRes, municipalityRes] =
                    await Promise.all([
                        axios.get(`${config.API_URL}/regions/${regionId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${config.API_URL}/provinces/${provinceId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(
                            `${config.API_URL}/municipalities/${municipalityId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        ),
                    ]);

                return {
                    region: regionRes.data,
                    province: provinceRes.data,
                    municipality: municipalityRes.data,
                };
            } catch (error) {
                console.error("Error fetching location by ID:", error);
                return {
                    region: null,
                    province: null,
                    municipality: null,
                };
            }
        },
        []
    );

    return {
        regions,
        provinces,
        municipalities,
        fetchRegions,
        fetchProvinces,
        fetchMunicipalities,
        fetchMunicipalitiesByRegion,
        getLocationById,
    };
};

export default useLocationData;
