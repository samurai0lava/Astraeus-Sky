## Project Notes

### Idea

Web app using **N2YO API** as the main data source to track satellites

(position, orbit, visible passes).

Goal: combine satellite data with **real-world observation context**

(weather, light pollution, astronomy).

---

### Data Sources

- **Satellite tracking**
    - N2YO API (positions, orbits, passes)
- **Weather**
    - OpenWeatherMap API
    - Used for: cloud cover, visibility, forecasts
- **Light pollution**
    - LightPollutionMap.info
    - World Atlas night sky brightness (map tiles)
- **Astronomy context**
    - From weather API:
        - Moon phase & illumination
        - Sun position (day / night / astronomical night)

---

### Architecture (High level)

**Frontend**

- React
- Mapbox GL JS
- UI/UX designed in Figma

**Backend**

- NestJS
- Aggregates data from:
    - N2YO
    - OpenWeatherMap
    - Astronomy data

**Cache**

- Redis
- Cache satellite passes + weather data to reduce API calls`

---

---