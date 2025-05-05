import { useState } from "react";
import axios from "axios";
import config from "./config";

const useLocationData = () => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);

    const fetchRegions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${config.API_URL}/regions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRegions(res.data);
        } catch {
            setRegions([]);
        }
    };

    const fetchProvinces = async (regionId) => {
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
    };

    const fetchMunicipalities = async (provinceId) => {
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
    };

    return {
        regions,
        provinces,
        municipalities,
        fetchRegions,
        fetchProvinces,
        fetchMunicipalities,
    };
};

export default useLocationData;
