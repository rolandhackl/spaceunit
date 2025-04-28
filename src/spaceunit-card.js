class SpaceUnitCard extends HTMLElement {
  setConfig(config) {
    if (!config.temp_entity) throw new Error("temp_entity fehlt!");
    this.config = config;

    // 👇 Buttons vorab rendern
    const buttons = (this.config.action_entities || [])
      .map((a, i) => `
        <li style="list-style: none; display: flex; align-items: center; justify-content: center; background: #5c5c5c; border-radius: 50%; width: 30px; height: 30px; margin: 5px;">
            <ha-icon  id="btn${i}" icon="${a.icon || 'mdi:help'}" style="--mdc-icon-size: 24px;"></ha-icon>
        </li>
      `)
      .join('');


    if(this.config.badgeicon) {
      const badge1 = "<span id=\"status-badge\" style=\"position: absolute; top: 4px; right: 4px; background: #2196f3; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;\"><ha-icon icon=\"${this.config.badgeicon || 'mdi:home'}\" style=\"--mdc-icon-size: 14px;\"></ha-icon></span>";
    }
    if(this.config.badgeicon2) {
      const badge2 = "<span style=\"position: absolute; top: top: 40px; left: 90px; background:rgb(237, 10, 10); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;\"><ha-icon icon=\"${this.config.badgeicon2 || 'mdi:home'}\" style=\"--mdc-icon-size: 14px;\"></ha-icon></span>";
    }
    this.innerHTML = `
      <ha-card style="overflow: hidden; padding: 12px; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto 1fr; height: 140px; position: relative; opacity: 0.7;">
        
        <!-- Titel oben links -->
        <div style="grid-column: 1; grid-row: 1; display: flex; flex-direction: column; justify-content: start;">
          <div style="font-weight: bold; font-size: 1.2em; margin-bottom: 4px;">
            ${this.config.title || 'SpaceUnit'}
          </div>
          <div id="statustxt" style="font-size: 0.9em; opacity: 0.75;">-- °C | -- %</div>
        </div>

        <!-- Rechte Button-Leiste -->
        <div style="grid-column: 2; grid-row: 1 / span 2; display: flex; flex-direction: column; justify-content: center; gap: 8px;">
          <ul>
            ${buttons}
          </ul>
        </div>

        <!-- Icon unten links -->
        <div style="grid-column: 1; grid-row: 2; position: relative;">
          <div style="position: absolute; left: -22px; top: 7px; width: 96px; height: 96px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
            <ha-icon icon="${this.config.icon || 'mdi:home'}" style="--mdc-icon-size: 64px;"></ha-icon>
            ${badge1}
            ${badge2}
          </div>
        </div>

      </ha-card>
    `;
  }

  set hass(hass) {
    // this.querySelector('#statustxt').textContent = `${this.config.statustxt}`;
    var statustxt = hass.states[this.config.entity_temp]?.state + "°C" || "";
    statustxt = statustxt + " | " || "";
    statustxt = statustxt + hass.states[this.config.entity_humid]?.state + "%" || "";
    this.querySelector("#statustxt").textContent = statustxt;


    // 🔁 Button-Aktionen verbinden
    (this.config.action_entities || []).forEach((a, i) => {
      const btn = this.querySelector(`#btn${i}`);
      if (!btn) return;
      btn.addEventListener('click', () => {
        hass.callService(
          entity_id.split(".")[0], // z.B. "light"
          "toggle",
          { entity_id }
        );
      });
    });
  }


  getCardSize() {
    return 2;
  }
}

customElements.define("spaceunit-card", SpaceUnitCard);
