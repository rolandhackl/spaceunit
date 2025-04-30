
# 🌌 SpaceUnit Card

**Kompakte Custom Card für Home Assistant**

## ⚙️ Konfiguration

```yaml
type: custom:spaceunit-card
title: Wohnzimmer
temp_entity: sensor.temperature_livingroom
```

## 🛠️ Installation (HACS)

1. Repository zu HACS hinzufügen: `https://github.com/dein-user/spaceunit`
2. Lovelace-Resource wird automatisch hinzugefügt:
   `/hacsfiles/spaceunit/spaceunit-card.js`
3. Danach: Dashboard → Karte manuell hinzufügen



## Testconfig

```yaml
type: custom:spaceunit-card
title: Büro
entity_temp: sensor.tempsensor
icon: mdi:monitor
entity: light.buro
status_entity: light.buro
action_entities:
  - entity: light.buro
    icon: mdi:lightbulb
    tap_action:
      action: toggle
  - entity: light.server_led
    icon: mdi:led-strip-variant
    tap_action:
      action: toggle
```
