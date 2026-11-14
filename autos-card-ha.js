/* autos-card-ha - carte Home Assistant visuelle pour voitures */
const VERSION = "0.3.0";

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
.chip.off { color: var(--disabled-text-color); }
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
.act.armed { border-color: var(--error-color); color: var(--error-color); }
.act[disabled] { opacity: .45; cursor: default; }
.na { color: var(--disabled-text-color); }
.banner { margin: 4px -4px 8px; display: flex; justify-content: center; }
.banner svg { width: 100%; max-width: 360px; height: auto; display: block; }
.banner img { width: 100%; max-height: 170px; object-fit: contain; display: block; }
.map { margin-top: 14px; border-radius: 12px; overflow: hidden; border: 1px solid var(--divider-color); min-height: 80px; }
.map ha-card { border: none; border-radius: 0; box-shadow: none; padding: 0; }
.nomap { padding: 28px 12px; text-align: center; font-size: 13px; color: var(--disabled-text-color); background: var(--secondary-background-color); }
.empty { padding: 24px 8px; text-align: center; color: var(--secondary-text-color); font-size: 14px; }
`;

const DOOR_GEOM = {
  front_left: { x: 41, y: 118, w: 9, h: 54, rot: -28, ox: 45, oy: 118 },
  front_right: { x: 150, y: 118, w: 9, h: 54, rot: 28, ox: 155, oy: 118 },
  rear_left: { x: 41, y: 178, w: 9, h: 50, rot: -28, ox: 45, oy: 178 },
  rear_right: { x: 150, y: 178, w: 9, h: 50, rot: 28, ox: 155, oy: 178 },
};

/* ------------------------------------------------------------------ */
/* Détection automatique                                              */
/* ------------------------------------------------------------------ */

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");

const DOOR_RE = {
  front_left: /(front_left|avant_gauche|conducteur|driver)/,
  front_right: /(front_right|avant_droit|passager|passenger)/,
  rear_left: /(rear_left|arriere_gauche)/,
  rear_right: /(rear_right|arriere_droit)/,
  tailgate: /(tailgate|hayon|coffre|trunk|boot|liftgate)/,
  hood: /(hood|capot|bonnet)/,
};
const DOOR_EXCL = /(tank|trappe|lid|window|vitre|fenetre|ceinture|seat|belt|sunroof|toit)/;

function windowLabel(t) {
  if (/(sunroof|toit)/.test(t)) return "Toit ouvrant";
  if (DOOR_RE.front_left.test(t.replace(/conducteur|driver/, "front_left"))) return "Vitre avant gauche";
  if (DOOR_RE.front_right.test(t.replace(/passager|passenger/, "front_right"))) return "Vitre avant droite";
  if (DOOR_RE.rear_left.test(t)) return "Vitre arrière gauche";
  if (DOOR_RE.rear_right.test(t)) return "Vitre arrière droite";
  return "Vitre";
}

function deviceName(hass, id) {
  const d = hass && hass.devices && hass.devices[id];
  return (d && (d.name_by_user || d.name)) || id;
}

function deviceEntities(hass, deviceId) {
  const out = [];
  const reg = hass.entities || {};
  for (const id of Object.keys(reg)) {
    const e = reg[id];
    if (e.device_id !== deviceId || e.hidden) continue;
    const st = hass.states[id];
    if (!st) continue;
    const slug = id.split(".")[1];
    out.push({
      id,
      domain: id.split(".")[0],
      st,
      dc: st.attributes.device_class,
      unit: st.attributes.unit_of_measurement,
      text: norm(slug + " " + (st.attributes.friendly_name || e.name || "")),
    });
  }
  return out;
}

function detectVehicle(hass, deviceId) {
  const E = deviceEntities(hass, deviceId);
  const pick = (pred, score) => {
    const l = E.filter(pred);
    if (score) l.sort((a, b) => score(b) - score(a));
    return l[0];
  };
  const sensor = (re, not) => pick((e) => e.domain === "sensor" && re.test(e.text) && !(not && not.test(e.text)));
  const kmOk = (e) => !e.unit || e.unit === "km" || e.unit === "mi";
  const r = { doors: {}, windows: [], stats: [], actions: [] };

  const trackers = E.filter((e) => e.domain === "device_tracker");
  const trk = trackers.find((e) => e.st.attributes.latitude !== undefined) || trackers[0];
  if (trk) r.location = trk.id;

  const bat = pick(
    (e) =>
      e.domain === "sensor" &&
      /(batter|battery|(^|_)soc($|_)|state_of_charge)/.test(e.text) &&
      !/(12v|service|soh|health|sante|capacit|resist|target|objectif|limit|tension|voltage|restante|remaining|temperature|speed|vitesse|type|fin_de|estim|distance|empty|autonomie|range)/.test(e.text) &&
      (!e.unit || e.unit === "%"),
    (e) => (e.dc === "battery" ? 2 : 0) + (/(niveau|level)/.test(e.text) ? 1 : 0)
  );
  if (bat) r.battery = bat.id;

  const fuel = pick(
    (e) =>
      e.domain === "sensor" &&
      /(fuel|carburant|essence)/.test(e.text) &&
      !/(distance|range|autonomie|consumption|conso|empty|average|moyenne|trip|lid|trappe|price|prix)/.test(e.text),
    (e) => (e.unit === "L" ? 2 : 0)
  );
  if (fuel) {
    r.fuel = fuel.id;
    if (fuel.unit === "%") r.fuel_max = 100;
  }

  const re = pick((e) => e.domain === "sensor" && /(empty_battery|battery_range|electric_range|range_electric|ev_range|autonomie_batterie|autonomie_electrique)/.test(e.text) && kmOk(e));
  if (re) r.range_electric = re.id;
  const rf = pick((e) => e.domain === "sensor" && /(empty_tank|fuel_range|range_fuel|autonomie_(carburant|essence)|empty_fuel)/.test(e.text) && kmOk(e));
  if (rf) r.range_fuel = rf.id;

  const lk = pick((e) => e.domain === "lock") || pick((e) => e.domain === "binary_sensor" && e.dc === "lock");
  if (lk) r.lock = lk.id;

  const ch =
    pick((e) => e.domain === "sensor" && /(charging_status|charge_status|etat_de_charge|statut_de_charge|charging_state)/.test(e.text)) ||
    pick((e) => e.domain === "binary_sensor" && (e.dc === "battery_charging" || /(en_charge|charging)/.test(e.text)) && !/(branchee|plugged|connect)/.test(e.text));
  if (ch) r.charging = ch.id;

  const eng = pick((e) => e.domain === "binary_sensor" && /(engine|moteur)/.test(e.text) && !/(oil|huile|coolant|service|fluid|temperature|liquide)/.test(e.text));
  if (eng) r.engine = eng.id;

  for (const k of Object.keys(DOOR_RE)) {
    const d = pick(
      (e) =>
        e.domain === "binary_sensor" &&
        (!e.dc || e.dc === "door" || e.dc === "opening") &&
        DOOR_RE[k].test(e.text) &&
        !DOOR_EXCL.test(e.text) &&
        /(door|porte|coffre|tailgate|hayon|trunk|boot|liftgate|hood|capot|bonnet)/.test(e.text)
    );
    if (d) r.doors[k] = d.id;
  }

  for (const e of E) {
    if (e.domain !== "binary_sensor") continue;
    if (!(e.dc === "window" || /(vitre|window|sunroof|toit)/.test(e.text))) continue;
    if (/(washer|lave|fluid|liquide)/.test(e.text)) continue;
    r.windows.push({ entity: e.id, name: windowLabel(e.text) });
  }

  const st = (e, name, icon) => {
    if (e) r.stats.push({ entity: e.id, name, icon });
  };
  st(sensor(/(odometer|kilometrage)/, /(avant|service|entretien|trip|dernier|distance_to)/), "Kilométrage", "mdi:counter");
  const tm = sensor(/trip_manual_distance/);
  const ta = sensor(/trip_automatic_distance/);
  const tl = sensor(/(dernier_trajet|last_trip)/);
  if (tm) st(tm, "Trajet manuel", "mdi:map-marker-distance");
  else if (ta) st(ta, "Trajet auto", "mdi:map-marker-distance");
  else st(tl, "Dernier trajet", "mdi:map-marker-distance");
  st(sensor(/(^|_)(soh_batterie|battery_soh|state_of_health|sante_batterie)/, /(capacit|resist)/), "Santé batterie", "mdi:battery-heart-variant");
  st(sensor(/(time_to_service|jours_avant_entretien|days_to_service)/), "Entretien dans", "mdi:wrench-clock");
  st(sensor(/(distance_to_service|kilometrage_avant_entretien|km_to_service)/), "Entretien (km)", "mdi:wrench");

  const BTN = E.filter((e) => e.domain === "button");
  const find = (re, not) => BTN.find((e) => re.test(e.text) && !(not && not.test(e.text)));
  const act = (e, name, icon, extra) => {
    if (e && !r.actions.some((a) => a.entity === e.id)) r.actions.push({ entity: e.id, name, icon, ...(extra || {}) });
  };
  act(find(/(^|_)(verrouiller|lock)(_|$)/, /(deverrouiller|unlock)/), "Verrouiller", "mdi:lock");
  act(find(/(deverrouiller|unlock)/), "Déverrouiller", "mdi:lock-open", { confirm: true });
  act(find(/(start_climati[sz]ation|demarrer_pre_?conditionnement|start_pre_?conditioning|preheat|prechauff)/), "Clim on", "mdi:air-conditioner");
  act(find(/(stop_climati[sz]ation|arreter_pre_?conditionnement|stop_pre_?conditioning)/), "Clim off", "mdi:air-conditioner");
  const hf = find(/honk_flash/);
  if (hf) act(hf, "Klaxon et feux", "mdi:bullhorn");
  else act(find(/(^|_)(honk|klaxon)(_|$)/, /flash/), "Klaxon", "mdi:bullhorn");
  act(find(/(demarrer_recharge|start_charg|demarrer_la_charge)/), "Démarrer charge", "mdi:battery-charging");
  act(find(/(arreter_recharge|stop_charg)/), "Arrêter charge", "mdi:battery-off");
  if (!hf) act(find(/(^|_)(flash|phares)(_|$)/, /honk/), "Feux", "mdi:car-light-high");
  r.actions = r.actions.slice(0, 6);

  return r;
}

function listVehicles(hass) {
  const reg = (hass && hass.entities) || {};
  const devs = new Set();
  for (const id of Object.keys(reg)) {
    const d = reg[id].device_id;
    if (d) devs.add(d);
  }
  const out = [];
  for (const did of devs) {
    const d = detectVehicle(hass, did);
    const signals = (d.lock ? 1 : 0) + (Object.keys(d.doors).length ? 1 : 0) + (d.battery ? 1 : 0) + (d.fuel ? 1 : 0);
    const vehicleOnly = d.location || d.fuel || d.range_electric || d.range_fuel || d.stats.some((s) => /Kilom/.test(s.name));
    if (vehicleOnly && signals >= 2) out.push({ id: did, name: deviceName(hass, did), detected: d });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/* ------------------------------------------------------------------ */
/* Carte                                                              */
/* ------------------------------------------------------------------ */

class AutosCardHa extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._eff = null;
    this._armed = null;
    this.shadowRoot.addEventListener("click", (e) => {
      const b = e.target.closest("[data-entity]");
      if (!b || b.disabled) return;
      const id = b.dataset.entity;
      if (b.dataset.confirm === "1" && this._armed !== id) {
        this._armed = id;
        clearTimeout(this._armT);
        this._armT = setTimeout(() => {
          this._armed = null;
          this._render();
        }, 3500);
        this._render();
        return;
      }
      this._armed = null;
      clearTimeout(this._armT);
      this._press(id);
      this._render();
    });
  }

  static getConfigElement() {
    return document.createElement("autos-card-ha-editor");
  }

  static getStubConfig(hass) {
    const v = hass ? listVehicles(hass)[0] : null;
    return v ? { device: v.id, name: v.name } : { name: "Ma voiture" };
  }

  setConfig(config) {
    if (!config) throw new Error("Configuration manquante");
    this._config = { ...config };
    this._mapEl = null;
    this._mapFor = null;
    this._mapPending = false;
    this._sig = null;
    this._det = null;
    if (this._hass) this._eff = this._effective();
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    this._eff = this._effective();
    const sig = this._signature();
    if (sig !== this._sig) {
      this._sig = sig;
      this._render();
    }
    if (this._mapEl) this._mapEl.hass = hass;
  }

  getCardSize() {
    return 7;
  }

  _detected(did) {
    const now = Date.now();
    const ents = this._hass.entities;
    const d = this._det;
    if (d && d.id === did && d.ents === ents && now - d.t < 30000) return d.res;
    const res = detectVehicle(this._hass, did);
    this._det = { id: did, ents, t: now, res };
    return res;
  }

  _effective() {
    const c = this._config;
    const hass = this._hass;
    const det = c.device && hass ? this._detected(c.device) : {};
    const clean = {};
    for (const [k, v] of Object.entries(c)) if (v !== undefined && v !== null && v !== "") clean[k] = v;
    const eff = { map_zoom: 15, ...det, ...clean };
    eff.doors = { ...(det.doors || {}), ...(clean.doors || {}) };
    eff.windows = clean.windows && clean.windows.length ? clean.windows : det.windows || [];
    eff.stats = clean.stats && clean.stats.length ? clean.stats : det.stats || [];
    eff.actions = clean.actions && clean.actions.length ? clean.actions : det.actions || [];
    if (!clean.name && c.device && hass) eff.name = deviceName(hass, c.device);
    if (eff.body_color === "theme") delete eff.body_color;
    return eff;
  }

  _signature() {
    const c = this._eff;
    if (!c || !this._hass) return "";
    const ids = [c.location, c.battery, c.fuel, c.range_electric, c.range_fuel, c.lock, c.charging, c.engine];
    ids.push(...Object.values(c.doors || {}));
    ids.push(...(c.windows || []).map((w) => (typeof w === "string" ? w : w.entity)));
    ids.push(...(c.stats || []).map((s) => s.entity));
    ids.push(...(c.actions || []).map((a) => a.entity));
    return (
      (c.name || "") +
      "#" +
      ids
        .filter(Boolean)
        .map((id) => {
          const s = this._hass.states[id];
          return s ? `${id}=${s.state}|${s.attributes.latitude || ""}|${s.attributes.longitude || ""}` : id;
        })
        .join(";")
    );
  }

  _hasPosition() {
    const s = this._state(this._eff.location);
    return !!s && s.attributes.latitude !== undefined && s.attributes.longitude !== undefined;
  }

  _ensureMap() {
    const c = this._eff;
    if (c.map === false || !c.location || !this._hasPosition()) return;
    if (this._mapEl && this._mapFor !== c.location) {
      this._mapEl = null;
      this._mapPending = false;
    }
    if (this._mapEl) {
      this._attachMap();
      return;
    }
    if (this._mapPending || !window.loadCardHelpers) return;
    this._mapPending = true;
    const loc = c.location;
    window
      .loadCardHelpers()
      .then((h) =>
        h.createCardElement({
          type: "map",
          entities: [{ entity: loc }],
          default_zoom: c.map_zoom,
          hours_to_show: 0,
          aspect_ratio: "16:9",
        })
      )
      .then((el) => {
        el.hass = this._hass;
        this._mapEl = el;
        this._mapFor = loc;
        this._attachMap();
      })
      .catch(() => {
        this._mapPending = false;
      });
  }

  _attachMap() {
    const holder = this.shadowRoot.getElementById("map");
    if (holder && this._mapEl && this._mapEl.parentNode !== holder) {
      holder.innerHTML = "";
      holder.appendChild(this._mapEl);
    }
  }

  _banner() {
    const c = this._eff;
    if (c.image) return `<div class="banner"><img src="${c.image}" alt="${c.name || "Voiture"}"></div>`;
    return `<div class="banner">${this._sideSvg()}</div>`;
  }

  _sideSvg() {
    const body = this._eff.body_color || "var(--primary-color)";
    return `<svg viewBox="0 0 400 150" role="img" aria-label="Illustration de la voiture">
      <ellipse cx="200" cy="132" rx="160" ry="7" fill="var(--divider-color)" opacity="0.6"/>
      <path d="M26 104 L26 92 Q28 82 48 78 L98 72 Q122 42 158 38 L248 38 Q286 40 306 70 L352 78 Q374 82 374 98 L374 110 Q374 118 366 118 L34 118 Q26 118 26 110 Z" fill="${body}" opacity="0.9"/>
      <path d="M118 70 Q136 48 162 46 L204 46 L204 70 Z" fill="var(--secondary-background-color)" opacity="0.95"/>
      <path d="M213 46 L248 46 Q270 48 288 70 L213 70 Z" fill="var(--secondary-background-color)" opacity="0.95"/>
      <path d="M208 46 L208 114 M140 72 L140 114" stroke="var(--card-background-color, #fff)" stroke-width="1.5" opacity="0.7" fill="none"/>
      <rect x="190" y="82" width="12" height="3.5" rx="1.7" fill="var(--card-background-color, #fff)" opacity="0.8"/>
      <rect x="120" y="82" width="12" height="3.5" rx="1.7" fill="var(--card-background-color, #fff)" opacity="0.8"/>
      <rect x="362" y="84" width="12" height="7" rx="3" fill="#ffd54f"/>
      <rect x="26" y="84" width="9" height="8" rx="3" fill="#e53935"/>
      <circle cx="96" cy="118" r="28" fill="var(--ha-card-background, var(--card-background-color, #fff))"/>
      <circle cx="304" cy="118" r="28" fill="var(--ha-card-background, var(--card-background-color, #fff))"/>
      <circle cx="96" cy="118" r="23" fill="#2b2b2b"/>
      <circle cx="304" cy="118" r="23" fill="#2b2b2b"/>
      <circle cx="96" cy="118" r="11" fill="var(--secondary-background-color)"/>
      <circle cx="304" cy="118" r="11" fill="var(--secondary-background-color)"/>
      <circle cx="96" cy="118" r="3" fill="var(--divider-color)"/>
      <circle cx="304" cy="118" r="3" fill="var(--divider-color)"/>
    </svg>`;
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
    const isNum = Number.isFinite(n) && /^-?[\d.]+$/.test(s.state);
    const v = isNum ? n.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state;
    return u && isNum ? `${v} ${u}` : v;
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
    const unit = unitOverride || this._state(id).attributes.unit_of_measurement || "";
    return `<div class="bar"><div class="top"><span>${label}</span><b>${Math.round(n)} ${unit}</b></div>
      <div class="track"><div class="fill" style="width:${pct}%;background:${this._color(pct)}"></div></div></div>`;
  }

  _carSvg() {
    const d = this._eff.doors || {};
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
    const c = this._eff || (this._eff = this._effective());
    const hasAnything = c.location || c.battery || c.fuel || c.lock || Object.keys(c.doors).length || c.stats.length;
    if (!hasAnything) {
      this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card><div class="empty">${
        this._config.device ? "Aucune entité détectée pour ce véhicule. Choisis-les à la main dans l'éditeur." : "Choisis un véhicule dans l'éditeur de la carte."
      }</div></ha-card>`;
      return;
    }

    const loc = this._state(c.location);
    const locTxt = loc && this._valid(loc) ? (loc.state === "home" ? "À la maison" : loc.state === "not_home" ? "Absente" : loc.state) : "";

    const chips = [];
    if (c.lock && this._state(c.lock)) {
      const s = this._state(c.lock);
      if (!this._valid(s)) {
        chips.push(`<div class="chip off"><ha-icon icon="mdi:lock-question"></ha-icon>Verrou indisponible</div>`);
      } else {
        const locked = c.lock.startsWith("lock.") ? s.state === "locked" : s.state === "off";
        chips.push(`<div class="chip ${locked ? "ok" : "warn"}"><ha-icon icon="mdi:${locked ? "lock" : "lock-open"}"></ha-icon>${locked ? "Verrouillée" : "Déverrouillée"}</div>`);
      }
    }
    if (c.charging && this._state(c.charging)) {
      const s = this._state(c.charging);
      let t;
      if (!this._valid(s)) t = "Charge indisponible";
      else if (c.charging.startsWith("binary_sensor.")) t = s.state === "on" ? "En charge" : "Pas en charge";
      else t = this._fmt(c.charging);
      chips.push(`<div class="chip ${this._valid(s) ? "" : "off"}"><ha-icon icon="mdi:ev-plug-type2"></ha-icon>${t}</div>`);
    }
    if (c.engine && this._state(c.engine)) {
      const s = this._state(c.engine);
      chips.push(
        this._valid(s)
          ? `<div class="chip"><ha-icon icon="mdi:engine"></ha-icon>${s.state === "on" ? "Moteur allumé" : "Moteur éteint"}</div>`
          : `<div class="chip off"><ha-icon icon="mdi:engine"></ha-icon>Moteur indisponible</div>`
      );
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

    const stats = (c.stats || [])
      .map((s) => `<div class="stat"><div class="l">${s.icon ? `<ha-icon icon="${s.icon}"></ha-icon>` : ""}${s.name || s.entity}</div><div class="v ${this._valid(this._state(s.entity)) ? "" : "na"}">${this._fmt(s.entity)}</div></div>`)
      .join("");

    const acts = (c.actions || [])
      .map((a) => {
        const st = this._state(a.entity);
        const dis = !st || st.state === "unavailable";
        const armed = this._armed === a.entity;
        return `<button class="act ${armed ? "armed" : ""}" data-entity="${a.entity}" ${a.confirm ? 'data-confirm="1"' : ""} ${dis ? "disabled" : ""}><ha-icon icon="${a.icon || "mdi:gesture-tap"}"></ha-icon>${armed ? "Confirmer ?" : a.name || a.entity}</button>`;
      })
      .join("");

    const unit = this._state(c.fuel) && this._state(c.fuel).attributes.unit_of_measurement;
    const fuelMax = c.fuel_max || (unit === "%" ? 100 : 70);
    const mapBlock = c.map !== false && c.location ? `<div class="map" id="map">${this._hasPosition() ? "" : '<div class="nomap">Position indisponible</div>'}</div>` : "";

    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
    <ha-card>
      <div class="head"><div class="name">${c.name || "Voiture"}</div>${locTxt ? `<div class="loc"><ha-icon icon="mdi:map-marker" style="--mdc-icon-size:14px"></ha-icon>${locTxt}</div>` : ""}</div>
      ${c.show_banner !== false ? this._banner() : ""}
      <div class="hero">
        <div class="car">${this._carSvg()}</div>
        <div class="bars">
          ${this._bar("Batterie", c.battery, 100, "%")}
          ${this._bar("Carburant", c.fuel, fuelMax)}
          ${c.range_electric ? `<div class="bar"><div class="top"><span>Autonomie électrique</span><b>${this._fmt(c.range_electric)}</b></div></div>` : ""}
          ${c.range_fuel ? `<div class="bar"><div class="top"><span>Autonomie essence</span><b>${this._fmt(c.range_fuel)}</b></div></div>` : ""}
        </div>
      </div>
      ${c.show_chips !== false && chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}
      ${mapBlock}
      ${c.show_stats !== false && stats ? `<div class="stats">${stats}</div>` : ""}
      ${c.show_actions !== false && acts ? `<div class="acts">${acts}</div>` : ""}
    </ha-card>`;
    this._ensureMap();
  }
}

/* ------------------------------------------------------------------ */
/* Éditeur visuel                                                     */
/* ------------------------------------------------------------------ */

const LABELS = {
  device: "Véhicule détecté",
  name: "Nom affiché",
  image: "Photo de la voiture (ex. /local/volvo.png)",
  body_color: "Couleur de l'illustration",
  map: "Afficher la carte",
  map_zoom: "Zoom de la carte",
  show_banner: "Afficher l'illustration",
  show_chips: "Afficher les statuts",
  show_stats: "Afficher les tuiles d'infos",
  show_actions: "Afficher les boutons",
  location: "Position (device tracker)",
  battery: "Batterie",
  fuel: "Carburant",
  fuel_max: "Capacité du réservoir (L)",
  range_electric: "Autonomie électrique",
  range_fuel: "Autonomie essence",
  lock: "Verrouillage",
  charging: "Charge",
  engine: "Moteur",
};

const EDITOR_DEFAULTS = { map: true, show_banner: true, show_chips: true, show_stats: true, show_actions: true, map_zoom: 15, body_color: "theme", device: "none" };

const COLORS = [
  { value: "theme", label: "Couleur du thème" },
  { value: "#1e88e5", label: "Bleu" },
  { value: "#e53935", label: "Rouge" },
  { value: "#43a047", label: "Vert" },
  { value: "#757575", label: "Gris" },
  { value: "#212121", label: "Noir" },
  { value: "#f9a825", label: "Jaune" },
  { value: "#8e24aa", label: "Violet" },
];

const DETECT_ROWS = [
  ["location", "Position", "mdi:map-marker"],
  ["battery", "Batterie", "mdi:battery"],
  ["fuel", "Carburant", "mdi:gas-station"],
  ["lock", "Verrouillage", "mdi:lock"],
  ["charging", "Charge", "mdi:ev-plug-type2"],
  ["engine", "Moteur", "mdi:engine"],
];

class AutosCardHaEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema(vehicles) {
    const entity = (name, domain) => ({ name, selector: { entity: { domain } } });
    const options = [{ value: "none", label: "Aucune détection (entités à choisir)" }];
    for (const v of vehicles) options.push({ value: v.id, label: v.name });
    const cur = this._config.device;
    if (cur && !vehicles.some((v) => v.id === cur)) options.push({ value: cur, label: deviceName(this._hass, cur) });
    return [
      { name: "device", selector: { select: { options, mode: "dropdown" } } },
      { name: "name", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
      { name: "body_color", selector: { select: { options: COLORS, mode: "dropdown" } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "show_banner", selector: { boolean: {} } },
          { name: "show_chips", selector: { boolean: {} } },
          { name: "show_stats", selector: { boolean: {} } },
          { name: "show_actions", selector: { boolean: {} } },
          { name: "map", selector: { boolean: {} } },
        ],
      },
      { name: "map_zoom", selector: { number: { min: 10, max: 19, step: 1, mode: "slider" } } },
      {
        type: "expandable",
        name: "",
        title: "Entités : remplacer la détection",
        flatten: true,
        schema: [
          entity("location", "device_tracker"),
          entity("battery", "sensor"),
          entity("fuel", "sensor"),
          { name: "fuel_max", selector: { number: { min: 10, max: 150, step: 1, mode: "box", unit_of_measurement: "L" } } },
          entity("range_electric", "sensor"),
          entity("range_fuel", "sensor"),
          entity("lock", ["lock", "binary_sensor"]),
          entity("charging", ["sensor", "binary_sensor"]),
          entity("engine", "binary_sensor"),
        ],
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._built) {
      this.innerHTML = `<style>
        .det { margin-top: 16px; padding: 12px 14px; border-radius: 12px; background: var(--secondary-background-color); font-size: 13px; color: var(--secondary-text-color); }
        .det .t { font-weight: 500; color: var(--primary-text-color); margin-bottom: 6px; }
        .det .r { display: flex; align-items: center; gap: 8px; padding: 3px 0; }
        .det .r ha-icon { --mdc-icon-size: 18px; }
        .det .ok ha-icon:last-child { color: var(--success-color, #43a047); }
        .det .no { color: var(--disabled-text-color); }
        .det code { font-size: 12px; }
      </style><ha-form></ha-form><div class="det"></div>`;
      this._form = this.querySelector("ha-form");
      this._det = this.querySelector(".det");
      this._form.addEventListener("value-changed", (e) => this._changed(e));
      this._built = true;
    }
    const vehicles = listVehicles(this._hass);
    this._vehicles = vehicles;
    this._form.hass = this._hass;
    const key = JSON.stringify([this._config, vehicles.map((v) => v.id)]);
    if (key === this._key) return;
    this._key = key;
    this._form.data = { ...EDITOR_DEFAULTS, ...this._config };
    this._form.schema = this._schema(vehicles);
    this._form.computeLabel = (s) => LABELS[s.name] || s.name;
    this._renderDetected();
  }

  _renderDetected() {
    const did = this._config.device;
    if (!did) {
      this._det.innerHTML = this._vehicles.length
        ? `<div class="t">${this._vehicles.length} véhicule(s) détecté(s)</div>Choisis ton véhicule dans la liste pour remplir la carte automatiquement.`
        : `<div class="t">Aucun véhicule détecté</div>Il faut un appareil avec au moins deux éléments parmi : verrou, portes, batterie, carburant. Tu peux aussi choisir les entités à la main ci-dessus.`;
      return;
    }
    const d = detectVehicle(this._hass, did);
    const row = (icon, label, id) =>
      `<div class="r ${id ? "ok" : "no"}"><ha-icon icon="${icon}"></ha-icon><span>${label}</span><span style="flex:1"></span>${id ? `<code>${id}</code><ha-icon icon="mdi:check-circle"></ha-icon>` : `<span>non trouvé</span><ha-icon icon="mdi:minus-circle-outline"></ha-icon>`}</div>`;
    const doors = Object.keys(d.doors).length;
    this._det.innerHTML =
      `<div class="t">Détection pour « ${deviceName(this._hass, did)} »</div>` +
      DETECT_ROWS.map(([k, label, icon]) => row(icon, label, d[k])).join("") +
      row("mdi:car-door", `Portes et ouvrants (${doors}/6)`, doors ? `${doors} trouvé(s)` : "") +
      row("mdi:window-open-variant", "Vitres", d.windows.length ? `${d.windows.length} trouvée(s)` : "") +
      row("mdi:view-grid", "Tuiles d'infos", d.stats.length ? `${d.stats.length} trouvée(s)` : "") +
      row("mdi:gesture-tap-button", "Boutons d'action", d.actions.length ? `${d.actions.length} trouvé(s)` : "");
  }

  _changed(ev) {
    ev.stopPropagation();
    const prev = this._config;
    const v = { ...prev, ...ev.detail.value };
    for (const k of Object.keys(v)) {
      if (v[k] === "" || v[k] === undefined || v[k] === null) delete v[k];
    }
    for (const [k, def] of Object.entries(EDITOR_DEFAULTS)) {
      if (v[k] === def && !(k in prev)) delete v[k];
    }
    if (v.device === "none") delete v.device;
    if (v.body_color === "theme") delete v.body_color;
    if (v.device && v.device !== prev.device && !prev.name) {
      const veh = (this._vehicles || []).find((x) => x.id === v.device);
      if (veh) v.name = veh.name;
    }
    v.type = prev.type || "custom:autos-card-ha";
    this._config = v;
    this._form.data = { ...EDITOR_DEFAULTS, ...v };
    this._renderDetected();
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: v }, bubbles: true, composed: true }));
  }
}

if (!customElements.get("autos-card-ha")) customElements.define("autos-card-ha", AutosCardHa);
if (!customElements.get("autos-card-ha-editor")) customElements.define("autos-card-ha-editor", AutosCardHaEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "autos-card-ha",
  name: "Autos Card HA",
  description: "Carte visuelle pour voitures : détection automatique, batterie, carburant, ouvertures, carte et actions",
  preview: false,
});
console.info(`%c AUTOS-CARD-HA %c v${VERSION} `, "color:white;background:#03a9f4;font-weight:700", "color:#03a9f4;background:white");

if (typeof module !== "undefined" && module.exports) module.exports = { detectVehicle, listVehicles, norm };
