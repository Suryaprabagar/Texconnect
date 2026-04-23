import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

const useStats = (refreshInterval = 60000) => {
  const [stats, setStats] = useState({
    suppliers: 0,
    products: 0,
    rfqs: 0,
    categories: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/stats/summary');
      if (response.data.success) {
        setStats(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch real-time statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up polling for "frequently updated" requirement
    const intervalId = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(intervalId);
  }, [fetchStats, refreshInterval]);

  return { stats, loading, error, refetch: fetchStats };
};

export default useStats;
