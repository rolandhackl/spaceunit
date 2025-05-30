class SpaceUnitCard extends HTMLElement {
  setConfig(config) {
    this.config = config;

    // 👇 Buttons vorab rendern
    const buttons = (this.config.action_entities || [])
      .map((a, i) => `
        <li style="list-style: none; align-items: center; background:rgb(49, 49, 49); border-radius: 50%; width: 35px; height: 35px; margin: 7px;">
            <ha-icon  id="btn${i}" icon="${a.icon || 'mdi:help'}" style="--mdc-icon-size: 22px; margin: 7px;"></ha-icon>
        </li>
      `)
      .join('');

    let badge1 = "";
    if (this.config.entity_temp) {
      badge1 = `<span id="status-badge" style="position: absolute; top: 4px; right: 4px; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 14px;"></span>`;
    }
    let badge2 = "";
    if(this.config.badge_icon2) {
    badge2 = `<span id="status-badge2" style="position: absolute; top: 40px; left: 90px; background: #2196f3; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 14px;"><ha-icon icon="${this.config.badgeicon2 || 'mdi:home'}" style="--mdc-icon-size: 16px;"></ha-icon></span>`;
    }
    this.innerHTML = `
      <style>
        @keyframes wobble {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-5deg); }
          50%  { transform: rotate(5deg); }
          75%  { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }

        .wobble {
          animation: wobble 0.5s ease-in-out;
        }

        .glow {
          box-shadow: 0 0 8px 4px #2196f3;
          border-radius: 50%;
          transition: box-shadow 0.3s ease-in-out;
        }

        .card-hover:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease-in-out;
        }
      </style>
      <ha-card style="overflow: hidden; padding: 12px; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto 1fr; height: 140px; position: relative; opacity: 0.8;">
        <!-- Titel oben links -->
        <div style="grid-column: 1; grid-row: 1; display: flex; flex-direction: column; justify-content: start; margin-right: 0px;">
          <div id="title_id_${this.config.title || 'SpaceUnit'}" style="font-weight: bold; font-size: 1.2em; margin-bottom: 4px; max-width: 30%;">
            ${this.config.title || 'SpaceUnit'}
          </div>
          <div id="statustxt" style="font-size: 0.7em; opacity: 0.75;"></div>
        </div>

        <!-- Rechte Button-Leiste -->
        <div style="grid-column: 2; grid-row: 1 / span 2; display: flex; flex-direction: column; justify-content: center; gap: 8px;">
          <ul style="padding-left:0px;">
            ${buttons}
          </ul>
        </div>

        <!-- Icon unten links -->
        <div style="grid-column: 1; grid-row: 2; position: relative;">
          <div style="position: absolute; left: -22px; top: 7px; width: 96px; height: 96px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
            <ha-icon id="bigicon" icon="${this.config.icon || 'mdi:home'}" 
                style="--mdc-icon-size: 64px; 
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
                font-size: 48px; /* Optional: für bessere Sichtbarkeit */
                color: gold;"></ha-icon>
            ${badge1}
            ${this.config.badge_icon2 ? badge2 : ''}
          </div>
        </div>

      </ha-card>
    `;
  }
  set hass(hass) {
    const temp = parseFloat(hass.states[this.config.entity_temp]?.state ?? NaN);
    const statustxt = isNaN(temp) ? "–" : `${temp}°C`;
    this.querySelector("#statustxt").textContent = statustxt;
  
    const badge = this.querySelector('#status-badge');
    if (badge) {
      const min = this.config.temp_min !== undefined ? parseFloat(this.config.temp_min) : 18;
      const max = this.config.temp_max !== undefined ? parseFloat(this.config.temp_max) : 26;
  
      if (temp >= max) {
        badge.innerHTML = `<ha-icon icon="mdi:fire" style="--mdc-icon-size: 16px;"></ha-icon>`;
        badge.style.background = "#ef5532";
      } else if (temp <= min) {
        badge.innerHTML = `<ha-icon icon="mdi:snowflake" style="--mdc-icon-size: 16px;"></ha-icon>`;
        badge.style.background = "#2196f3";
      } else {
      }
    }
  
    // 🔁 Button-Aktionen verbinden
    (this.config.action_entities || []).forEach((a, i) => {
      const btn = this.querySelector(`#btn${i}`);
      if (!btn) return;
  
      const entityState = hass.states[a.entity]?.state;
      btn.style.color = entityState === 'on' ? '#ffea00' : '';
  
      btn.addEventListener('mousedown', () => (btn.style.transform = 'scale(0.9)'));
      btn.addEventListener('mouseup', () => (btn.style.transform = 'scale(1)'));
      btn.addEventListener('mouseleave', () => (btn.style.transform = 'scale(1)'));
  
      btn.addEventListener('click', () => {
        hass.callService(a.entity.split(".")[0], "toggle", { entity_id: a.entity });
  
        setTimeout(() => {
          const newState = hass.states[a.entity]?.state;
          btn.style.color = newState === 'on' ? '#ffea00' : '';
        }, 300);
      });
    });
  
    const title = this.querySelector("div[style*='font-weight: bold']");
    const icon = this.querySelector("ha-icon[icon='" + (this.config.icon || 'mdi:home') + "']");
    const bigIcon = this.querySelector("ha-icon[icon='" + (this.config.icon || 'mdi:home') + "']");
    if (bigIcon && this.config.entity) {
      const entityState = hass.states[this.config.entity]?.state;
      bigIcon.style.color = entityState === 'on' ? 'yellow' : '';
    }

    if (this.config.bigiconstate) {
      const entityState = hass.states[this.config.bigiconstate]?.state;
      const bigIcon = this.querySelector("#bigicon");
      if (bigIcon) {
        const iconOn = this.config.icon_on || "mdi:lightbulb-on";
        const iconOff = this.config.icon_off || "mdi:lightbulb-off";
        bigIcon.setAttribute("icon", entityState === "on" ? iconOn : iconOff);
      }
    }

    if (this.config.tap_action?.action === 'navigate') {

      // if (!title.hasNavigateHandler) {
      //   title.addEventListener("click", () => {
      //     const navPath = this.config.tap_action?.navigation_path;
      //     if (navPath) {
      //       // 🔥 Animation triggern
      //       title.classList.add("wobble");
      //       title.parentElement.classList.add("glow");

      //       setTimeout(() => {
      //         title.classList.remove("wobble");
      //         title.parentElement.classList.remove("glow");
      //       }, 300);

      //       setTimeout(() => {
      //         // 🕒 Navigation erst jetzt!
      //         window.history.pushState(null, "", navPath);
      //         window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
      //       }, 400);
      //     }
      //   });
      //   title.hasNavigateHandler = true;
      // }

      if (!this._titleHasNavigateHandler) {
        title.addEventListener("click", () => {
          const navPath = this.config.tap_action?.navigation_path;
          if (navPath) {
            title.classList.add("wobble");

            setTimeout(() => {
              title.classList.remove("wobble");
            }, 300);

            setTimeout(() => {
              window.history.pushState(null, "", navPath);
              window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
            }, 400);
          }
        });
        this._titleHasNavigateHandler = true;
      }

      if (!this._iconHasNavigateHandler) {
        icon.addEventListener("click", () => {
          const navPath = this.config.tap_action?.navigation_path;
          if (navPath) {
            icon.classList.add("wobble");
            icon.parentElement.classList.add("glow");

            setTimeout(() => {
              icon.classList.remove("wobble");
              icon.parentElement.classList.remove("glow");
            }, 300);

            setTimeout(() => {
              window.history.pushState(null, "", navPath);
              window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
            }, 400);
          }
        });
        this._iconHasNavigateHandler = true;
      }

      // if (!icon.hasNavigateHandler) {
      //   icon.addEventListener("click", () => {
      //     const navPath = this.config.tap_action?.navigation_path;
      //     if (navPath) {
      //       // 🔥 Animation triggern
      //       icon.classList.add("wobble");
      //       icon.parentElement.classList.add("glow");

      //       setTimeout(() => {
      //         icon.classList.remove("wobble");
      //         icon.parentElement.classList.remove("glow");
      //       }, 300);

      //       setTimeout(() => {
      //         // 🕒 Navigation erst jetzt!
      //         window.history.pushState(null, "", navPath);
      //         window.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
      //       }, 400);
      //     }
      //   });
      //   icon.hasNavigateHandler = true;
      // }

    }
    if (hass.states[this.config.entity]?.state === "on") {
      const entityState = hass.states[this.config.entity]?.state;

      const card = this.querySelector('ha-card');
      // card.style.color = "yellow";
      card.style.backgroundColor =  "#322f00";
    

    } else {
      const card = this.querySelector('ha-card');
      // card.style.color = "";
      card.style.backgroundColor = "#282828";
    }
  }
  

  getCardSize() {
    return 2;
  }
}

customElements.define("spaceunit-card", SpaceUnitCard);