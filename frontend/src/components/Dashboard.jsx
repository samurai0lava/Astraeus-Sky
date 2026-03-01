import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./Dashboard.css";
import SatelliteMap from "../components/SatelliteMap";

const DASHBOARD_API = "/api/dashboard";
const PAGE_SIZE = 10;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const isFetching = useRef(false);

  const fetchDashboard = useCallback(
    async (signal = null, lat = null, lng = null) => {
      if (isFetching.current) return;
      isFetching.current = true;
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
        isFetching.current = false;
      }
    },
    []
  );

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

  const filteredCards = useMemo(() => {
    if (!hasCards) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.cards;
    return data.cards.filter((card) =>
      card.title.toLowerCase().includes(q)
    );
  }, [data, hasCards, search]);

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

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
            <div className="dashboard__cards-section">
              <div className="dashboard__search-bar">
                <input
                  type="text"
                  className="dashboard__search-input"
                  placeholder="Search satellite by name…"
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Search satellites"
                />
                <span className="dashboard__search-count">
                  {filteredCards.length} / {data.cards.length} satellites
                </span>
              </div>

              {filteredCards.length === 0 ? (
                <p className="dashboard__empty">No satellites match &ldquo;{search}&rdquo;.</p>
              ) : (
                <>
                  <div className="dashboard__cards">
                    {visibleCards.map((card, i) => (
                      <article key={i} className="dashboard__card">
                        <h3 className="dashboard__card-title">{card.title}</h3>
                        {card.description && (
                          <p className="dashboard__card-description">{card.description}</p>
                        )}
                      </article>
                    ))}
                  </div>

                  {hasMore && (
                    <button
                      type="button"
                      className="dashboard__load-more"
                      onClick={handleLoadMore}
                    >
                      Load more ({filteredCards.length - visibleCount} remaining)
                    </button>
                  )}
                </>
              )}
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