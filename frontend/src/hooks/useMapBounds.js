import { useState, useEffect, useCallback, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

/**
 * Custom hook that tracks the current map bounds and updates them
 * on moveend/zoomend events. Uses a debounce to avoid excessive
 * state updates during rapid pan/zoom interactions.
 *
 * WHY THIS HELPS:
 * - Without viewport culling, every satellite in the dataset creates
 *   a Leaflet layer object AND a React element — even those offscreen.
 * - By exposing bounds we let the parent filter to only the visible
 *   satellites, cutting render work by 80-95% at typical zoom levels.
 * - Debouncing the bounds update (default 150 ms) prevents a cascade
 *   of re-renders while the user is still dragging/zooming.
 */
export default function useMapBounds(debounceMs = 150) {
  const map = useMap();
  const [bounds, setBounds] = useState(() => map.getBounds());
  const timerRef = useRef(null);

  const updateBounds = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setBounds(map.getBounds());
    }, debounceMs);
  }, [map, debounceMs]);

  // Listen to moveend, zoomend, and the one-time load event
  useMapEvents({
    moveend: updateBounds,
    zoomend: updateBounds,
    // 'load' fires once when the map is fully initialised and sized,
    // ensuring getBounds() returns real coordinates on first paint
    load: updateBounds,
  });

  // Set initial bounds on mount (synchronous best-effort)
  useEffect(() => {
    setBounds(map.getBounds());
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [map]);

  return bounds;
}
