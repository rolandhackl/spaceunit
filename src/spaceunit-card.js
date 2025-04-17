
class SpaceUnitCard extends HTMLElement {
  setConfig(config) {
    if (!config.temp_entity) {
      throw new Error("temp_entity fehlt!");
    }

    this.config = config;
    this.innerHTML = `
      <ha-card header="${this.config.title || 'SpaceUnit'}">
        <div style="padding: 16px;">
          <p>Temperatur: <span id="temp">–</span></p>
        </div>
      </ha-card>
    `;
  }

  set hass(hass) {
    const temp = hass.states[this.config.temp_entity]?.state ?? "–";
    this.querySelector("#temp").textContent = temp + " °C";
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("spaceunit-card", SpaceUnitCard);
