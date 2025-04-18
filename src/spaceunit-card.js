class SpaceUnitCard extends HTMLElement {
  setConfig(config) {
    if (!config.temp_entity) {
      throw new Error("temp_entity fehlt!");
    }

    this.config = config;
    this.innerHTML = `
      <ha-card style="padding: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; position: relative;">
            <ha-icon icon="\${this.config.icon || 'mdi:home'}" style="--mdc-icon-size: 36px;"></ha-icon>
            <span id="status-badge" style="position: absolute; top: 4px; right: 4px; background: #2196f3; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;">?</span>
          </div>
          <div style="margin-left: 12px;">
            <div style="font-weight: bold; font-size: 1.1em;">\${this.config.title || 'SpaceUnit'}</div>
            <div id="temps" style="opacity: 0.85; font-size: 0.9em;">-- °C | -- %</div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          \${(this.config.action_entities || []).map((a, i) => \`
            <ha-icon-button id="btn\${i}" icon="\${a.icon || 'mdi:help'}" style="opacity: 0.7;"></ha-icon-button>
          \`).join('')}
        </div>
      </ha-card>
    `;
  }

  set hass(hass) {
    const temp = hass.states[this.config.temp_entity]?.state || '--';
    const hum = hass.states[this.config.humidity_entity]?.state || '--';
    this.querySelector('#temps').textContent = `\${temp} °C | \${hum} %`;

    const status = hass.states[this.config.status_entity]?.state || '?';
    this.querySelector('#status-badge').textContent = status;

    (this.config.action_entities || []).forEach((a, i) => {
      const btn = this.querySelector('#btn' + i);
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
