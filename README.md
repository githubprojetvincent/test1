# WiFi Sense

Radar expérimental de détection de présence humaine par Wi‑Fi, sans caméra ni appareil porté par la personne.

## Principe

Le projet vise le **Wi‑Fi sensing** : on analyse les variations du canal radio, notamment la CSI (Channel State Information), pour estimer si une présence humaine perturbe la propagation du Wi‑Fi. La CSI peut être utilisée pour inférer des changements physiques de l'environnement, notamment des mouvements humains. citeturn481873search0

### Ce que montre l'interface

- radar de présence dans une pièce
- état **ZONE LIBRE / HUMAIN DÉTECTÉ**
- estimation de confiance
- détection de mouvement
- courbe de variation du signal
- surveillance automatique
- historique des détections

## Important

La version web actuelle est une **interface de démonstration** : elle simule les mesures afin de visualiser l'expérience utilisateur. Un navigateur seul ne peut pas récupérer les données CSI brutes du Wi‑Fi domestique comme un capteur dédié.

Pour une vraie détection, il faut un matériel compatible CSI, par exemple un ESP32/ESP32‑S3 selon l'implémentation choisie. Espressif fournit le projet ESP-CSI avec des exemples de détection d'activité humaine et de sensing Wi‑Fi. citeturn481873search0

## Architecture réelle envisagée

```text
Wi‑Fi / routeur
      ↓
ESP32 compatible CSI
      ↓
Amplitude / phase CSI
      ↓
Filtrage + extraction de caractéristiques
      ↓
Détection présence / mouvement
      ↓
API locale
      ↓
Interface WiFi Sense
```

Des prototypes publics montrent déjà une détection de présence et de mouvement avec ESP32 + CSI, avec parfois une estimation de position ou plusieurs états humains. citeturn481873search1turn481873search3

## Lancer l'interface

```bash
npm install
npm run dev
```

## Objectif V2

Brancher un flux CSI réel, calibrer automatiquement la pièce vide, puis envoyer au dashboard une mesure locale du type :

`presence: true | false`

`motion: true | false`

`confidence: 0..100`

> À utiliser uniquement dans un espace que vous êtes autorisé à surveiller. Ce système estime une présence ; il n'identifie pas une personne.
