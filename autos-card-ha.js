/* autos-card-ha - carte Home Assistant visuelle pour voitures */
const VERSION = "0.1.0";

const STYLE = `
:host { display: block; }
ha-card { padding: 16px; overflow: hidden; }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.name { font-size: 20px; font-weight: 500; color: var(--primary-text-color); }
.loc { font-size: 13px; color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px; }
.hero { display: flex; align-items: center; gap: 12px; }
.car { flex: 0 0 38%; max-width: 150px; }
.car svg { width: 100%; height: auto; display: block; }
.bars { flex: 1; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.bar .top { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; color: var(--secondary-text-color); margin-bottom: 4px; }
.bar .top b { font-size: 18px; font-weight: 500; color: var(--primary-text-color); }
.track { height: 8px; border-radius: 4px; background: var(--divider-color); overflow: hidden; }
.fill { height: 100%; border-radius: 4px; transition: width .4s; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 0; }
.chip { display: flex; align-items: center; gap: 6px; font-size: 13px; padding: 6px 10px; border-radius: 16px; background: var(--secondary-background-color); color: var(--primary-text-color); }
.chip.warn { background: var(--error-color); color: #fff; }
.chip.ok ha-icon { color: var(--success-color, #43a047); }
.chip ha-icon { --mdc-icon-size: 16px; }
.stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 14px; }
.stat { background: var(--secondary-background-color); border-radius: 12px; padding: 10px 12px; }
.stat .l { font-size: 12px; color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px; }
.stat .l ha-icon { --mdc-icon-size: 14px; }
.stat .v { font-size: 16px; font-weight: 500; color: var(--primary-text-color); margin-top: 2px; }
.acts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
.act { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border-radius: 12px; border: 1px solid var(--divider-color); background: transparent; color: var(--primary-text-color); font: inherit; font-size: 14px; cursor: pointer; }
.act:active { background: var(--secondary-background-color); }
.na { color: var(--disabled-text-color); }
`;

const DOOR_GEOM = {
  front_left: { x: 41, y: 118, w: 9, h: 54, rot: -28, ox: 45, oy: 118 },
  front_right: { x: 150, y: 118, w: 9, h: 54, rot: 28, ox: 155, oy: 118 },
  rear_left: { x: 41, y: 178, w: 9, h: 50, rot: -28, ox: 45, oy: 178 },
  rear_right: { x: 150, y: 178, w: 9, h: 50, rot: 28, ox: 155, oy: 178 },
};

class AutosCardHa extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this.shadowRoot.addEventListener("click", (e) => {
      const b = e.target.closest("[data-entity]");
      if (b) this._press(b.dataset.entity);
    });
  }

  setConfig(config) {
    if (!config) throw new Error("Configuration manquante");
    this._config = {
      fuel_max: 100,
      doors: {},
      windows: [],
      stats: [],
      actions: [],
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return { name: "Ma voiture", battery: "sensor.ma_voiture_batterie" };
  }

  _state(id) {
    if (!id || !this._hass) return undefined;
    return this._hass.states[id];
  }

  _valid(s) {
    return s && s.state !== "unavailable" && s.state !== "unknown";
  }

  _num(id) {
    const s = this._state(id);
    if (!this._valid(s)) return null;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : null;
  }

  _fmt(id) {
    const s = this._state(id);
    if (!s) return "n/d";
    if (!this._valid(s)) return "Indisponible";
    const u = s.attributes.unit_of_measurement;
    const n = parseFloat(s.state);
    const v = Number.isFinite(n) && /^-?[\d.]+$/.test(s.state) ? n.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state;
    return u && Number.isFinite(n) && /^-?[\d.]+$/.test(s.state) ? `${v} ${u}` : v;
  }

  _isOpen(id) {
    const s = this._state(id);
    return !!s && s.state === "on";
  }

  _press(id) {
    if (!this._hass || !id) return;
    const domain = id.split(".")[0];
    if (domain === "button") this._hass.callService("button", "press", { entity_id: id });
    else if (domain === "lock") {
      const locked = this._state(id) && this._state(id).state === "locked";
      this._hass.callService("lock", locked ? "unlock" : "lock", { entity_id: id });
    } else this._hass.callService("homeassistant", "toggle", { entity_id: id });
  }

  _color(pct) {
    if (pct < 20) return "var(--error-color)";
    if (pct < 40) return "var(--warning-color, #ffa600)";
    return "var(--success-color, #43a047)";
  }

  _bar(label, id, max, unitOverride) {
    if (!id) return "";
    const n = this._num(id);
    if (n === null) {
      return `<div class="bar"><div class="top"><span>${label}</span><b class="na">n/d</b></div><div class="track"></div></div>`;
    }
    const pct = Math.max(0, Math.min(100, (n / max) * 100));
    const unit = unitOverride || (this._state(id).attributes.unit_of_measurement || "");
    return `<div class="bar"><div class="top"><span>${label}</span><b>${Math.round(n)} ${unit}</b></div>
      <div class="track"><div class="fill" style="width:${pct}%;background:${this._color(pct)}"></div></div></div>`;
  }

  _carSvg() {
    const d = this._config.doors || {};
    const open = (k) => (d[k] ? this._isOpen(d[k]) : false);
    const col = (o) => (o ? "var(--error-color)" : "var(--primary-color)");
    let doors = "";
    for (const k of Object.keys(DOOR_GEOM)) {
      const g = DOOR_GEOM[k];
      const o = open(k);
      doors += `<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="3" fill="${col(o)}" opacity="${o ? 1 : 0.35}" ${o ? `transform="rotate(${g.rot} ${g.ox} ${g.oy})"` : ""}/>`;
    }
    const hood = open("hood");
    const tail = open("tailgate");
    return `<svg viewBox="0 0 200 340" role="img" aria-label="Voiture vue de dessus">
      <rect x="50" y="22" width="100" height="296" rx="44" fill="var(--secondary-background-color)" stroke="var(--divider-color)" stroke-width="2"/>
      <path d="M64 100 Q100 84 136 100 L132 128 Q100 120 68 128 Z" fill="var(--divider-color)"/>
      <path d="M68 232 Q100 240 132 232 L136 256 Q100 268 64 256 Z" fill="var(--divider-color)"/>
      <rect x="66" y="132" width="68" height="96" rx="10" fill="none" stroke="var(--divider-color)" stroke-width="1.5"/>
      <rect x="62" y="30" width="76" height="50" rx="22" fill="${col(hood)}" opacity="${hood ? 0.9 : 0.18}" ${hood ? 'transform="translate(0 -8)"' : ""}/>
      <rect x="62" y="270" width="76" height="40" rx="18" fill="${col(tail)}" opacity="${tail ? 0.9 : 0.18}" ${tail ? 'transform="translate(0 8)"' : ""}/>
      ${doors}
    </svg>`;
  }

  _render() {
    if (!this._config || !this._hass) return;
    const c = this._config;
    const loc = this._state(c.location);
    const locTxt = loc ? (loc.state === "home" ? "À la maison" : loc.state === "not_home" ? "Absente" : loc.state) : "";

    const chips = [];
    if (c.lock && this._state(c.lock)) {
      const locked = this._state(c.lock).state === "locked";
      chips.push(`<div class="chip ${locked ? "ok" : "warn"}"><ha-icon icon="mdi:${locked ? "lock" : "lock-open"}"></ha-icon>${locked ? "Verrouillée" : "Déverrouillée"}</div>`);
    }
    if (c.charging && this._state(c.charging)) {
      chips.push(`<div class="chip"><ha-icon icon="mdi:ev-plug-type2"></ha-icon>${this._fmt(c.charging)}</div>`);
    }
    if (c.engine && this._state(c.engine)) {
      chips.push(`<div class="chip"><ha-icon icon="mdi:engine"></ha-icon>${this._isOpen(c.engine) ? "Moteur allumé" : "Moteur éteint"}</div>`);
    }
    const names = { front_left: "Porte avant gauche", front_right: "Porte avant droite", rear_left: "Porte arrière gauche", rear_right: "Porte arrière droite", tailgate: "Coffre", hood: "Capot" };
    for (const k of Object.keys(c.doors || {})) {
      if (this._isOpen(c.doors[k])) chips.push(`<div class="chip warn"><ha-icon icon="mdi:car-door"></ha-icon>${names[k] || k}</div>`);
    }
    for (const w of c.windows || []) {
      const id = typeof w === "string" ? w : w.entity;
      const nm = typeof w === "string" ? id : w.name || id;
      if (this._isOpen(id)) chips.push(`<div class="chip warn"><ha-icon icon="mdi:window-open-variant"></ha-icon>${nm}</div>`);
    }

    const stats = (c.stats || []).map((s) => `<div class="stat"><div class="l">${s.icon ? `<ha-icon icon="${s.icon}"></ha-icon>` : ""}${s.name || s.entity}</div><div class="v ${this._valid(this._state(s.entity)) ? "" : "na"}">${this._fmt(s.entity)}</div></div>`).join("");

    const acts = (c.actions || []).map((a) => `<button class="act" data-entity="${a.entity}"><ha-icon icon="${a.icon || "mdi:gesture-tap"}"></ha-icon>${a.name || a.entity}</button>`).join("");

    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
    <ha-card>
      <div class="head"><div class="name">${c.name || "Voiture"}</div>${locTxt ? `<div class="loc"><ha-icon icon="mdi:map-marker" style="--mdc-icon-size:14px"></ha-icon>${locTxt}</div>` : ""}</div>
      <div class="hero">
        <div class="car">${this._carSvg()}</div>
        <div class="bars">
          ${this._bar("Batterie", c.battery, 100, "%")}
          ${this._bar("Carburant", c.fuel, c.fuel_max)}
          ${c.range_electric ? `<div class="bar"><div class="top"><span>Autonomie électrique</span><b>${this._fmt(c.range_electric)}</b></div></div>` : ""}
          ${c.range_fuel ? `<div class="bar"><div class="top"><span>Autonomie essence</span><b>${this._fmt(c.range_fuel)}</b></div></div>` : ""}
        </div>
      </div>
      ${chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}
      ${stats ? `<div class="stats">${stats}</div>` : ""}
      ${acts ? `<div class="acts">${acts}</div>` : ""}
    </ha-card>`;
  }
}

if (!customElements.get("autos-card-ha")) customElements.define("autos-card-ha", AutosCardHa);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "autos-card-ha",
  name: "Autos Card HA",
  description: "Carte visuelle pour voitures (batterie, carburant, ouvertures, actions)",
});
console.info(`%c AUTOS-CARD-HA %c v${VERSION} `, "color:white;background:#03a9f4;font-weight:700", "color:#03a9f4;background:white");
