import { useMemo } from "react";

/**
 * Filters the full satellite array down to only those whose lat/lng
 * fall inside the supplied Leaflet LatLngBounds, with a configurable
 * padding factor so satellites about to scroll into view are already
 * rendered (avoids pop-in).
 *
 * WHY THIS HELPS:
 * - At zoom level 7 the viewport might cover ~5% of the globe.
 *   Filtering out 95% of markers means React reconciles and Leaflet
 *   paints far fewer elements each frame.
 * - useMemo ensures we only recompute when the satellite data or
 *   bounds identity actually changes, not on every parent render.
 * - The padding factor (default 1.2 = 20% overscan) keeps near-edge
 *   satellites ready so panning feels smooth.
 *
 * @param {Array}  satellites  Full satellite array (objects with .lat, .lng)
 * @param {L.LatLngBounds|null} bounds  Current viewport bounds
 * @param {number} paddingFactor  Multiplier to expand bounds (1 = exact, 1.2 = 20% overscan)
 * @returns {Array} Subset of satellites visible in the padded viewport
 */
export default function useVisibleSatellites(satellites, bounds, paddingFactor = 1.2) {
  return useMemo(() => {
    if (!bounds || !satellites?.length) return satellites ?? [];

    // Expand bounds by the padding factor for smoother edge rendering
    const padded = bounds.pad(paddingFactor - 1); // pad() takes a ratio, 0.2 = 20%

    const south = padded.getSouth();
    const north = padded.getNorth();
    const west = padded.getWest();
    const east = padded.getEast();

    const filtered = satellites.filter((sat) => {
      const { lat, lng } = sat;
      return lat >= south && lat <= north && lng >= west && lng <= east;
    });

    // Safety: if bounds filtering removed everything, the map likely
    // hasn't settled yet (e.g. during flyTo). Return all satellites so
    // the user always sees something on screen.
    return filtered.length > 0 ? filtered : satellites;
  }, [satellites, bounds, paddingFactor]);
}
