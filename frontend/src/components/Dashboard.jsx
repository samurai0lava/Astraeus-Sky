/**
 * Dashboard section. Fetches from GET /api/dashboard.
 * Expected response shape:
 *   { stats?: Array<{ label: string, value: string | number }>, cards?: Array<{ title: string, description?: string, ... }> }
 * Missing or empty arrays are handled (nothing or "No data" shown).
 */
import { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';

const DASHBOARD_API = '/api/dashboard';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async (signal = null, lat = null, lng = null) => {
        setLoading(true);
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
            if (err.name !== 'AbortError') setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchDashboard(controller.signal, latitude, longitude);
                },
                (error) => {
                    // If geolocation fails, fallback to default fetch
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
        // Retry with geolocation if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchDashboard(null, latitude, longitude);
                },
                () => {
                    fetchDashboard();
                },
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

                    {!hasStats && !hasCards && (
                        <p className="dashboard__empty">No data available.</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default Dashboard;
