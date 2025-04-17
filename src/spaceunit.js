
class SpaceUnit extends HTMLElement {
  setConfig(config) {
    this.config = config;
    this.innerHTML = `
      <div style="padding: 16px; border-radius: 10px; background: #2c2c2e; color: white;">
        <h2>${this.config.title || 'SpaceUnit'}</h2>
        <p>Raumtemperatur: <span id="temp">–</span></p>
      </div>
    `;
  }

  set hass(hass) {
    const temp = hass.states[this.config.temp_entity]?.state || '–';
    this.querySelector('#temp').textContent = temp + " °C";
  }

  getCardSize() {
    return 2;
  }
}

customElements.define('spaceunit', SpaceUnit);
