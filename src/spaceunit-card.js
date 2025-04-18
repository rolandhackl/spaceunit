class SpaceUnitCard extends HTMLElement {
  setConfig(config) {
    if (!config.temp_entity) {
      throw new Error("temp_entity fehlt!");
    }

    this.config = config;
    this.innerHTML = `
      <ha-card header="${this.config.title || 'SpaceUnit'}">
        <div style="padding: 16px; display: flex; flex-direction: column; align-items: center;">
          <ha-icon icon="${this.config.icon || 'mdi:cyber-space'}" style="font-size: 48px; margin-bottom: 8px;"></ha-icon>
          <p>Temperatur: <span id="temp">–</span></p>
        </div>
      </ha-card>
    `;
  }

  set hass(hass) {
    const state = hass.states[this.config.temp_entity]?.state ?? "–";
    this.querySelector("#temp").textContent = state + " °C";

    // Füge eine gelbe Umrandung hinzu, wenn der Zustand "on" ist
    const card = this.querySelector("ha-card");
    if (state === "on") {
      card.style.border = "2px solid yellow";
    } else {
      card.style.border = "";
    }
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("spaceunit-card", SpaceUnitCard);
