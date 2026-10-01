# AC RouteForge

Original browser-based track prototyping studio for Assetto Corsa.

## Goal
Trace a real-world route on a web map, generate a procedural road + terrain preview, edit the route, and export project data for an Assetto Corsa build pipeline.

## MVP
- Interactive map (OpenStreetMap via Leaflet)
- Search any location
- Click-to-draw road centerline
- Road width and banking controls
- Procedural 3D preview in Three.js
- Route statistics
- JSON project export
- Clear separation between browser preview and final KN5 export pipeline

## Why the architecture is split
Assetto Corsa tracks ultimately use game-specific assets such as KN5. The browser editor therefore creates a clean track project and preview; a desktop/CI exporter can convert the scene into the game format using a compatible Blender/KN5 toolchain.

## Run
Open `index.html` with a local web server, for example:

```bash
python -m http.server 8080
```

Then browse to `http://localhost:8080/ac-routeforge/`.

## Licensing
Do not redistribute Google Maps/Google Street View imagery or proprietary Assetto Corsa/Kunos assets. This MVP uses OpenStreetMap for the map layer and generates original preview geometry.
