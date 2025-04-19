class SpaceUnitCard extends HTMLElement {
  setConfig(config) {
    if (!config.temp_entity) throw new Error("temp_entity fehlt!");
    this.config = config;

    // 👇 Buttons vorab rendern
    const buttons = (this.config.action_entities || [])
      .map((a, i) => `
        <ha-icon-button id="btn${i}" icon="${a.icon || 'mdi:help'}" style="opacity: 0.7;"></ha-icon-button>
      `)
      .join('');

    this.innerHTML = `
      <ha-card style="padding: 12px; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto 1fr; height: 120px; position: relative;">
        
        <!-- Titel oben links -->
        <div style="grid-column: 1; grid-row: 1; display: flex; flex-direction: column; justify-content: start;">
          <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 4px;">
            ${this.config.title || 'SpaceUnit'}
          </div>
          <div id="temps" style="font-size: 0.9em; opacity: 0.85;">-- °C | -- %</div>
        </div>

        <!-- Rechte Button-Leiste -->
        <div style="grid-column: 2; grid-row: 1 / span 2; display: flex; flex-direction: column; justify-content: center; gap: 8px;">
          ${buttons}
        </div>

        <!-- Icon unten links -->
        <div style="grid-column: 1; grid-row: 2; position: relative;">
          <div style="position: absolute; bottom: -12px; left: -12px; width: 96px; height: 96px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
            <ha-icon icon="${this.config.icon || 'mdi:home'}" style="--mdc-icon-size: 64px;"></ha-icon>
            <span id="status-badge" style="position: absolute; top: 4px; right: 4px; background: #2196f3; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;">?</span>
          </div>
        </div>

      </ha-card>
    `;
  }

  set hass(hass) {
    const temp = hass.states[this.config.temp_entity]?.state || '--';
    const hum = hass.states[this.config.humidity_entity]?.state || '--';
    this.querySelector('#temps').textContent = `${temp} °C | ${hum} %`;

    const status = hass.states[this.config.status_entity]?.state || '?';
    this.querySelector('#status-badge').textContent = status;

    // 🔁 Button-Aktionen verbinden
    (this.config.action_entities || []).forEach((a, i) => {
      const btn = this.querySelector(`#btn${i}`);
      if (!btn) return;
      btn.addEventListener('click', () => {
        hass.callService(
          a.entity.split('.')[0],
          a.tap_action || 'toggle',
          { entity_id: a.entity }
        );
      });
    });
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("spaceunit-card", SpaceUnitCard);
