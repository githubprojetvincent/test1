# WiFi Radar Home

Prototype de radar Wi-Fi pour surveiller les appareils présents sur son propre réseau local.

## Concept

L'application affiche les appareils détectés autour d'un radar :

- scan du réseau local
- nombre d'appareils actifs
- affichage radar
- état détecté / disparu
- estimation de proximité basée sur le RSSI lorsque disponible

> Important : ce projet détecte des appareils réseau/radio, pas directement des personnes. Un appareil éteint, en mode avion ou non connecté peut ne pas être détecté.

## Architecture proposée

Frontend : React + TypeScript + Vite

Backend : Python + FastAPI

Scanner réseau : Nmap sur le réseau local autorisé

## Lancer

```bash
npm install
npm run dev
```

Le backend devra exposer une route `/api/scan` qui retourne les appareils détectés.
