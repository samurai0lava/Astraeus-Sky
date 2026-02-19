## Project Notes

### Idea

Web app using **N2YO API** as the main data source to track satellites

(position, orbit, visible passes).


---

### Data Sources

- **Satellite tracking**
    - N2YO API (positions, orbits, passes)

---

### Architecture (High level)

**Frontend**

- React
- Mapbox GL JS
- UI/UX designed in Figma

**Backend**

- ExpressJS
- Aggregates data from:
    - N2YO
    - OpenWeatherMap
    - Astronomy data

**Cache**

- Redis
- Cache satellite passes to reduce API calls`

---

---