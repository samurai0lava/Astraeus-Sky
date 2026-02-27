import { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import SatelliteMap from "../components/SatelliteMap";

const DASHBOARD_API = "/api/dashboard";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });

  const fetchDashboard = useCallback(
    async (signal = null, lat = null, lng = null) => {
      setError(null);
      try {
        let url = DASHBOARD_API;
        if (lat !== null && lng !== null) {
          url += `?lat=${lat}&lng=${lng}`;
        }
        const options = signal ? { signal } : {};
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Refresh using last known coords (called by SatelliteMap every 5s)
  const handleRefresh = useCallback(() => {
    fetchDashboard(null, userCoords.lat, userCoords.lng);
  }, [fetchDashboard, userCoords]);

  useEffect(() => {
    const controller = new AbortController();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          fetchDashboard(controller.signal, latitude, longitude);
        },
        () => {
          fetchDashboard(controller.signal);
        },
        { enableHighAccuracy: true }
      );
    } else {
      fetchDashboard(controller.signal);
    }
    return () => controller.abort();
  }, [fetchDashboard]);

  const handleRetry = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          fetchDashboard(null, latitude, longitude);
        },
        () => fetchDashboard(),
        { enableHighAccuracy: true }
      );
    } else {
      fetchDashboard();
    }
  };

  const hasStats = Array.isArray(data?.stats) && data.stats.length > 0;
  const hasCards = Array.isArray(data?.cards) && data.cards.length > 0;

  return (
    <section className="dashboard" aria-label="Dashboard">
      <h2 className="dashboard__title">Dashboard</h2>

      {loading && (
        <div className="dashboard__loading" role="status" aria-live="polite">
          Loading…
        </div>
      )}

      {error && (
        <div className="dashboard__error" role="alert">
          <p className="dashboard__error-message">{error}</p>
          <button type="button" className="dashboard__retry" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="dashboard__content">
          {data.satellites && (
            <SatelliteMap
              user={data.user}
              satellites={data.satellites}
              onRefresh={handleRefresh} 
            />
          )}

          {hasStats && (
            <div className="dashboard__stats">
              {data.stats.map((stat, i) => (
                <div key={i} className="dashboard__stat-card">
                  <span className="dashboard__stat-value">{stat.value}</span>
                  <span className="dashboard__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {hasCards && (
            <div className="dashboard__cards">
              {data.cards.map((card, i) => (
                <article key={i} className="dashboard__card">
                  <h3 className="dashboard__card-title">{card.title}</h3>
                  {card.description && (
                    <p className="dashboard__card-description">{card.description}</p>
                  )}
                </article>
              ))}
            </div>
          )}

          {!hasStats && !hasCards && !data.above && (
            <p className="dashboard__empty">No data available.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Dashboard;