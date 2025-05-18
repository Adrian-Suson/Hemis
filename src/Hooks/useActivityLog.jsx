// src/hooks/useActivityLog.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../utils/config';

const useActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch activity logs
    const fetchLogs = useCallback(async (newPage = 1, filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${config.API_URL}/activity-logs`, {
                params: {
                    page: newPage,
                    per_page: 20,
                    ...filters
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const { data, current_page, last_page, total } = response.data;
            setLogs(prev => (newPage === 1 ? data : [...prev, ...data]));
            setPage(current_page);
            setLastPage(last_page);
            setTotal(total);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch activity logs');
        } finally {
            setLoading(false);
        }
    }, []);

    // Create a new activity log
    const createLog = useCallback(async (logData) => {
        setLoading(true);
        setError(null);
        try {
            const userId = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post(`${config.API_URL}/activity-logs`, {
                user_id: userId.id,
                action: logData.action,
                description: logData.description,

            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            await fetchLogs(1); // Refresh logs after creating
            return response.data;
        } catch (err) {
            setError(err.response?.data?.errors || 'Failed to create activity log');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchLogs]);

    // Load more logs
    const loadMore = useCallback(() => {
        if (page < lastPage && !loading) {
            setPage(prev => prev + 1);
            fetchLogs(page + 1);
        }
    }, [page, lastPage, loading, fetchLogs]);

    return {
        logs,
        loading,
        error,
        page,
        lastPage,
        total,
        fetchLogs,
        createLog,
        loadMore
    };
};

export default useActivityLog;
