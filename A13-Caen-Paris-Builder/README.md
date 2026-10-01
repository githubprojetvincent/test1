# A13 Caen → Paris — Real Assetto Corsa Builder

Générateur de source pour construire l'A13 réelle à partir d'OpenStreetMap, puis préparer des secteurs Blender/KN5 pour Assetto Corsa.

## Pipeline
1. fetch_a13_osm.py — récupère les ways A13 via Overpass.
2. build_corridor.py — convertit les géométries en GeoJSON.
3. blender/build_a13.py — construit la base route dans Blender.
4. Export KN5.
5. Ajouter collision/surfaces/AI/timing/pits.
6. Tester chaque secteur dans Assetto Corsa.

Les assets propriétaires Kunos ne sont pas redistribués. Les arbres/décor AC locaux peuvent être utilisés dans le pipeline utilisateur.

Attribution : © OpenStreetMap contributors, ODbL.
