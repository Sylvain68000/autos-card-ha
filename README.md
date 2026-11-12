# Autos Card HA

Carte Home Assistant visuelle pour suivre ses voitures : batterie, carburant, autonomie, portes et ouvertures (illustration vue de dessus), statuts et boutons d'action.

## Installation avec HACS

1. HACS > menu ⋮ > **Dépôts personnalisés**.
2. Ajouter l'URL de ce dépôt, type **Tableau de bord**.
3. Installer **Autos Card HA**, puis recharger la page.

## Configuration

Volvo XC60 :

```yaml
type: custom:autos-card-ha
name: Volvo XC60
location: device_tracker.volvo_xc60
battery: sensor.volvo_xc60_batterie
fuel: sensor.volvo_xc60_fuel_amount
fuel_max: 70
range_electric: sensor.volvo_xc60_distance_to_empty_battery
range_fuel: sensor.volvo_xc60_distance_to_empty_tank
lock: lock.volvo_xc60_lock
charging: sensor.volvo_xc60_charging_status
engine: binary_sensor.volvo_xc60_engine_status
doors:
  front_left: binary_sensor.volvo_xc60_door_front_left
  front_right: binary_sensor.volvo_xc60_door_front_right
  rear_left: binary_sensor.volvo_xc60_door_rear_left
  rear_right: binary_sensor.volvo_xc60_door_rear_right
  tailgate: binary_sensor.volvo_xc60_tailgate
  hood: binary_sensor.volvo_xc60_hood
windows:
  - entity: binary_sensor.volvo_xc60_window_front_left
    name: Vitre avant gauche
  - entity: binary_sensor.volvo_xc60_window_front_right
    name: Vitre avant droite
  - entity: binary_sensor.volvo_xc60_window_rear_left
    name: Vitre arrière gauche
  - entity: binary_sensor.volvo_xc60_window_rear_right
    name: Vitre arrière droite
  - entity: binary_sensor.volvo_xc60_sunroof
    name: Toit ouvrant
stats:
  - entity: sensor.volvo_xc60_odometer
    name: Kilométrage
    icon: mdi:counter
  - entity: sensor.volvo_xc60_trip_manual_distance
    name: Trajet manuel
    icon: mdi:map-marker-distance
  - entity: sensor.volvo_xc60_time_to_service
    name: Entretien dans
    icon: mdi:wrench-clock
  - entity: sensor.volvo_xc60_distance_to_service
    name: Entretien dans (km)
    icon: mdi:wrench
actions:
  - entity: button.volvo_xc60_start_climatization
    name: Clim on
    icon: mdi:air-conditioner
  - entity: button.volvo_xc60_stop_climatization
    name: Clim off
    icon: mdi:air-conditioner
  - entity: button.volvo_xc60_honk_flash
    name: Klaxon et feux
    icon: mdi:bullhorn
```

Peugeot (électrique) :

```yaml
type: custom:autos-card-ha
name: Peugeot
location: device_tracker.vr3uhzkxznt055916_vehicule
battery: sensor.vr3uhzkxznt055916_niveau_batterie
range_electric: sensor.vr3uhzkxznt055916_autonomie_batterie
doors:
  front_left: binary_sensor.vr3uhzkxznt055916_porte_conducteur
  front_right: binary_sensor.vr3uhzkxznt055916_porte_passager
  rear_left: binary_sensor.vr3uhzkxznt055916_porte_arriere_gauche
  rear_right: binary_sensor.vr3uhzkxznt055916_porte_arriere_droite
  tailgate: binary_sensor.vr3uhzkxznt055916_coffre
stats:
  - entity: sensor.vr3uhzkxznt055916_kilometrage
    name: Kilométrage
    icon: mdi:counter
  - entity: sensor.vr3uhzkxznt055916_soh_batterie
    name: Santé batterie
    icon: mdi:battery-heart-variant
  - entity: sensor.vr3uhzkxznt055916_dernier_trajet
    name: Dernier trajet
    icon: mdi:map-marker-distance
  - entity: sensor.vr3uhzkxznt055916_jours_avant_entretien
    name: Entretien dans (jours)
    icon: mdi:wrench-clock
actions:
  - entity: button.vr3uhzkxznt055916_verrouiller_portes
    name: Verrouiller
    icon: mdi:lock
  - entity: button.vr3uhzkxznt055916_deverrouiller_portes
    name: Déverrouiller
    icon: mdi:lock-open
  - entity: button.vr3uhzkxznt055916_demarrer_pre_conditionnement
    name: Préchauffage
    icon: mdi:air-conditioner
  - entity: button.vr3uhzkxznt055916_demarrer_recharge
    name: Démarrer charge
    icon: mdi:battery-charging
```

## Options

| Option | Rôle |
| --- | --- |
| `name` | Titre de la carte |
| `location` | `device_tracker` pour afficher « À la maison » |
| `battery`, `fuel`, `fuel_max` | Barres de batterie (en %) et de carburant |
| `range_electric`, `range_fuel` | Autonomies affichées à côté des barres |
| `lock`, `charging`, `engine` | Pastilles de statut |
| `doors` | `front_left`, `front_right`, `rear_left`, `rear_right`, `tailgate`, `hood` : l'ouverture s'anime sur l'illustration |
| `windows` | Liste d'entités ouvertes à signaler |
| `stats` | Tuiles d'information (`entity`, `name`, `icon`) |
| `actions` | Boutons (`button.*` presse, `lock.*` verrouille ou déverrouille, autres entités basculent) |
| `image` | Photo de la voiture (par exemple `/local/volvo.png`, fichier placé dans `/config/www/`). Remplace l'illustration du bandeau |
| `body_color` | Couleur de la carrosserie de l'illustration (par exemple `#1e88e5`) |
| `map` | `false` pour masquer la mini-carte (affichée par défaut dès que `location` fournit une position) |
| `map_zoom` | Niveau de zoom de la mini-carte (15 par défaut) |

Tous les champs sont facultatifs : ce qui n'est pas configuré n'est pas affiché.
