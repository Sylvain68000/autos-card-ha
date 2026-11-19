/* autos-card-ha - carte Home Assistant visuelle pour voitures */
const VERSION = "0.6.0";

const STYLE = `
:host { display: block; }
ha-card { padding: 16px; overflow: hidden; }
.tabs { display: flex; gap: 6px; margin-bottom: 12px; padding: 4px; border-radius: 14px; background: var(--secondary-background-color); }
.tab { flex: 1 1 0; min-width: 0; border: none; border-radius: 10px; padding: 8px 10px; background: transparent; color: var(--secondary-text-color); font: inherit; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background .2s, color .2s; }
.tab.on { background: var(--card-background-color, #fff); color: var(--primary-text-color); box-shadow: 0 1px 4px rgba(0,0,0,.18); }
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.name { font-size: 20px; font-weight: 500; color: var(--primary-text-color); }
.loc { font-size: 13px; color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px; }
.hero { display: flex; align-items: center; gap: 12px; }
.car { flex: 0 0 46%; max-width: 200px; }
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
.act.on { border-color: var(--primary-color); color: var(--primary-color); }
.act[disabled] { opacity: .45; cursor: default; }
.na { color: var(--disabled-text-color); }
.banner { margin: 4px -4px 8px; display: flex; justify-content: center; }
.banner svg { width: 100%; max-width: 360px; height: auto; display: block; }
.banner img { width: 100%; max-height: 170px; object-fit: contain; display: block; }
.banner .stack { position: relative; width: 100%; max-width: 440px; }
.banner .stack img { width: 100%; height: auto; max-height: none; display: block; }
.banner .stack img.layer { position: absolute; inset: 0; opacity: 0; transition: opacity .3s; }
.banner .stack img.layer.on { opacity: 1; }
.map { position: relative; isolation: isolate; margin-top: 14px; border-radius: 18px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); overflow: hidden; min-height: 80px; background: var(--secondary-background-color); }
.map ha-card { border: none; border-radius: 0; box-shadow: none; padding: 0; }
.addr { position: absolute; left: 10px; right: 58px; bottom: 10px; z-index: 1001; display: flex; align-items: center; gap: 10px; padding: 9px 14px 9px 10px; width: fit-content; max-width: calc(100% - 68px); border-radius: 14px; background: color-mix(in srgb, var(--card-background-color, #fff) 82%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 2px 10px rgba(0,0,0,.22); pointer-events: none; color: var(--primary-text-color); }
.nav { position: absolute; right: 10px; bottom: 10px; z-index: 1001; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--primary-color); color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,.3); text-decoration: none; cursor: pointer; }
.nav ha-icon { --mdc-icon-size: 22px; }
[data-info] { cursor: pointer; }
[data-info]:active { opacity: .7; }
.addr:empty { display: none; }
.addr ha-icon { --mdc-icon-size: 22px; flex: 0 0 auto; color: var(--primary-color); }
.addr .l1 { font-size: 14px; font-weight: 500; line-height: 1.25; }
.addr .l2 { font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--secondary-text-color); }
.nomap { padding: 28px 12px; text-align: center; font-size: 13px; color: var(--disabled-text-color); background: var(--secondary-background-color); }
.empty { padding: 24px 8px; text-align: center; color: var(--secondary-text-color); font-size: 14px; }
`;

const FR_STATE = {
  idle: "Au repos",
  charging: "En charge",
  done: "Terminée",
  fault: "Défaut",
  connected: "Branchée",
  disconnected: "Débranchée",
  no_power_available: "Pas d'alimentation",
  on: "Activé",
  off: "Désactivé",
  open: "Ouvert",
  closed: "Fermé",
  locked: "Verrouillée",
  unlocked: "Déverrouillée",
  running: "En marche",
  stopped: "Arrêtée",
  home: "À la maison",
  not_home: "Absente",
  no_warning: "Aucune alerte",
  warning: "Alerte",
  none: "Aucun",
  true: "Oui",
  false: "Non",
  unavailable: "Indisponible",
  unknown: "Inconnu",
};
const FR_UNIT = { d: "j" };

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
  const od = sensor(/(odometer|kilometrage)/, /(avant|service|entretien|trip|dernier|distance_to)/);
  if (od) r.odometer = od.id;
  const ad = sensor(/(adresse|address)/, /(mail|(^|_)ip(_|$)|mac)/);
  if (ad) r.address = ad.id;
  const tm = sensor(/trip_manual_distance/);
  const ta = sensor(/trip_automatic_distance/);
  const tl = sensor(/(dernier_trajet|last_trip)/);
  if (tm) st(tm, "Trajet manuel", "mdi:map-marker-distance");
  else if (ta) st(ta, "Trajet auto", "mdi:map-marker-distance");
  else st(tl, "Dernier trajet", "mdi:map-marker-distance");
  const noTotal = /(total|cumul)/;
  const cf = sensor(/manual_average_fuel_consumption/, noTotal) || sensor(/(average_fuel_consumption|fuel_consumption|consommation_(carburant|essence)|conso_(carburant|essence))/, noTotal);
  if (cf) r.consumption_fuel = cf.id;
  const ce = sensor(/manual_average_energy_consumption/, noTotal) || sensor(/(average_energy_consumption|energy_consumption|electric_consumption|consommation_(electrique|energie)|conso_electrique)/, noTotal);
  if (ce) r.consumption_electric = ce.id;
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
  const cOn = find(/(start_climati[sz]ation|demarrer_pre_?conditionnement|start_pre_?conditioning|preheat|prechauff)/);
  const cOff = find(/(stop_climati[sz]ation|arreter_pre_?conditionnement|stop_pre_?conditioning)/);
  const cSt = pick((e) => ["binary_sensor", "switch", "climate"].includes(e.domain) && /(climati[sz]ation|pre_?conditionnement|preconditioning|preheat|prechauff)/.test(e.text) && !/(commande|command|erreur|error)/.test(e.text));
  if (cOn) r.climate_on = cOn.id;
  if (cOff) r.climate_off = cOff.id;
  if (cSt) r.climate_state = cSt.id;
  if (cOn && cOff) r.actions.push({ climate: true, name: "Clim", icon: "mdi:air-conditioner" });
  else {
    act(cOn, "Activer la clim", "mdi:air-conditioner");
    act(cOff, "Couper la clim", "mdi:air-conditioner-off");
  }
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
    const vehicleOnly = d.location || d.fuel || d.range_electric || d.range_fuel || d.odometer;
    if (vehicleOnly && signals >= 2) out.push({ id: did, name: deviceName(hass, did), detected: d });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/* ------------------------------------------------------------------ */
/* Carte                                                              */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const GEO_MEM = new Map();

function fmtAddress(j) {
  const a = (j && j.address) || {};
  const road = a.road || a.pedestrian || a.footway || a.path || a.residential || "";
  const l1 = [road, a.house_number].filter(Boolean).join(" ") || (j && j.name) || String((j && j.display_name) || "").split(",")[0];
  const l2 = a.village || a.town || a.city || a.municipality || a.hamlet || a.suburb || "";
  return { l1, l2 };
}

/* Option `geocode: true` uniquement : adresse via OpenStreetMap (Nominatim), depuis le navigateur.
   Les coordonnées sont arrondies à environ 10 m et la réponse est mise en cache dans le navigateur. */
function reverseGeocode(lat, lon) {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (GEO_MEM.has(key)) return GEO_MEM.get(key);
  try {
    const raw = localStorage.getItem("autos-card-ha:geo:" + key);
    if (raw) {
      const p = Promise.resolve(JSON.parse(raw));
      GEO_MEM.set(key, p);
      return p;
    }
  } catch (e) {}
  const p = fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=fr&lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .then((j) => {
      const v = fmtAddress(j);
      try {
        localStorage.setItem("autos-card-ha:geo:" + key, JSON.stringify(v));
      } catch (e) {}
      return v;
    })
    .catch(() => {
      GEO_MEM.delete(key);
      return null;
    });
  GEO_MEM.set(key, p);
  return p;
}

class AutosCardHa extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = null;
    this._eff = null;
    this._armed = null;
    this.shadowRoot.addEventListener("click", (e) => {
      const cl = e.target.closest("[data-climate]");
      if (cl) {
        if (!cl.disabled) this._toggleClimate();
        return;
      }
      const tab = e.target.closest("[data-tab]");
      if (tab) {
        this._selectVehicle(Number(tab.dataset.tab));
        return;
      }
      const inf = e.target.closest("[data-info]");
      const b = e.target.closest("[data-entity]");
      if (inf && !b) {
        this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: inf.dataset.info }, bubbles: true, composed: true }));
        return;
      }
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
    this._base = { ...config };
    this._vlist = null;
    this._sel = 0;
    this._setupVehicles();
    this._applyVehicle();
  }

  _vehicleList() {
    const v = this._base.vehicles;
    if (Array.isArray(v) && v.length) return v.map((x) => (typeof x === "string" ? { device: x } : { ...x })).filter((x) => x.device || x.location);
    if (v === "auto" && this._hass) return listVehicles(this._hass).map((x) => ({ device: x.id }));
    return null;
  }

  _setupVehicles() {
    const list = this._vehicleList();
    if (list && list.length > 1) {
      this._vlist = list;
      let i = 0;
      try {
        const saved = localStorage.getItem("autos-card-ha:sel:" + list.map((x) => x.device || x.location).join(","));
        i = list.findIndex((x) => (x.device || x.location) === saved);
      } catch (e) {
        i = 0;
      }
      this._sel = i > 0 ? i : 0;
    } else {
      this._vlist = null;
      this._sel = 0;
    }
  }

  _selectVehicle(i) {
    if (!this._vlist || i === this._sel || !this._vlist[i]) return;
    this._sel = i;
    try {
      const l = this._vlist;
      localStorage.setItem("autos-card-ha:sel:" + l.map((x) => x.device || x.location).join(","), l[i].device || l[i].location);
    } catch (e) {
      /* ignore */
    }
    this._armed = null;
    this._applyVehicle();
  }

  _applyVehicle() {
    const { vehicles, ...rest } = this._base;
    if (this._vlist) delete rest.name;
    this._config = { ...rest, ...((this._vlist && this._vlist[this._sel]) || {}) };
    this._mapEl = null;
    this._mapFor = null;
    this._mapPending = false;
    this._sig = null;
    this._det = null;
    this._addr = null;
    this._addrKey = null;
    this._climT = undefined;
    this._climPend = null;
    if (this._hass) this._eff = this._effective();
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (this._base.vehicles === "auto" && !this._vlist) {
      this._setupVehicles();
      if (this._vlist) this._applyVehicle();
    }
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
    if (clean.show_address === false) eff.address = false;
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
    ids.push(c.climate_state, c.climate_on, c.climate_off, typeof c.address === "string" ? c.address : null, c.odometer, c.consumption_fuel, c.consumption_electric);
    return (
      (c.name || "") +
      "~" +
      this._sel +
      "@" +
      this._mapLocations().join(",") +
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

  // Position de la voiture principale + autres véhicules (liste manuelle ou détection automatique).
  _mapLocations() {
    const c = this._eff;
    const out = [c.location];
    const has = (id) => {
      const s = this._state(id);
      return !!s && s.attributes.latitude !== undefined && s.attributes.longitude !== undefined;
    };
    const add = (id) => {
      if (id && !out.includes(id) && has(id)) out.push(id);
    };
    (Array.isArray(c.map_extra) ? c.map_extra : []).forEach(add);
    if (c.map_all_vehicles !== false && this._hass) {
      try {
        listVehicles(this._hass).forEach((v) => add(v.detected && v.detected.location));
      } catch (e) {
        /* ignore */
      }
    }
    return out;
  }

  _ensureMap() {
    const c = this._eff;
    if (c.map === false || !c.location || !this._hasPosition()) return;
    const locs = this._mapLocations();
    const locKey = locs.join(",");
    if (this._mapEl && this._mapFor !== locKey) {
      this._mapEl = null;
      this._mapPending = false;
    }
    if (this._mapEl) {
      this._attachMap();
      return;
    }
    if (this._mapPending || !window.loadCardHelpers) return;
    this._mapPending = true;
    window
      .loadCardHelpers()
      .then((h) =>
        h.createCardElement({
          type: "map",
          entities: locs.map((entity) => ({ entity, label_mode: c.map_label || (locs.length > 1 ? "name" : "icon") })),
          default_zoom: c.map_zoom,
          hours_to_show: 0,
          aspect_ratio: "20:9",
          theme_mode: c.map_theme || "light",
        })
      )
      .then((el) => {
        el.hass = this._hass;
        this._mapEl = el;
        this._mapFor = locKey;
        this._attachMap();
      })
      .catch(() => {
        this._mapPending = false;
      });
  }

  _attachMap() {
    const holder = this.shadowRoot.getElementById("mapslot");
    if (holder && this._mapEl && this._mapEl.parentNode !== holder) {
      holder.innerHTML = "";
      holder.appendChild(this._mapEl);
    }
  }

  _navUrl() {
    const t = this._state(this._eff.location);
    const at = (t && t.attributes) || {};
    return at.latitude != null ? `https://www.google.com/maps/dir/?api=1&destination=${at.latitude},${at.longitude}` : "#";
  }

  _addressHtml() {
    const a = this._addr;
    if (!a || !a.l1) return "";
    return `<ha-icon icon="mdi:map-marker"></ha-icon><div><div class="l1">${esc(a.l1)}</div>${a.l2 ? `<div class="l2">${esc(a.l2)}</div>` : ""}</div>`;
  }

  _setAddr(v) {
    this._addr = v;
    const el = this.shadowRoot.getElementById("addr");
    if (el) el.innerHTML = this._addressHtml();
  }

  _updateAddress() {
    const c = this._eff;
    if (c.map === false || c.address === false || !c.location) return;
    if (typeof c.address === "string") {
      const ae = this._state(c.address);
      if (ae && this._valid(ae)) {
        const parts = String(ae.state).split(",").map((x) => x.trim()).filter(Boolean);
        this._setAddr({ l1: parts[0] || "", l2: parts.slice(1).join(", ").replace(/^\d{4,5}\s+/, "") });
      }
      return;
    }
    if (c.geocode !== true) return;
    const s = this._state(c.location);
    if (!s || s.attributes.latitude === undefined) return;
    const lat = Number(s.attributes.latitude);
    const lon = Number(s.attributes.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (key === this._addrKey) return;
    const wait = 30000 - (Date.now() - (this._geoAt || 0));
    if (wait > 0 && this._addr) {
      clearTimeout(this._geoT);
      this._geoT = setTimeout(() => this._updateAddress(), wait + 50);
      return;
    }
    this._addrKey = key;
    this._geoAt = Date.now();
    reverseGeocode(lat, lon).then((v) => {
      if (this._addrKey !== key) return;
      if (v) this._setAddr(v);
      else {
        this._addrKey = null;
        clearTimeout(this._geoT);
        this._geoT = setTimeout(() => this._updateAddress(), 60000);
      }
    });
  }

  _climKey() {
    return "autos-card-ha:clim:" + (this._eff.climate_on || "");
  }

  _climStart() {
    if (this._climT === undefined) {
      try {
        this._climT = Number(localStorage.getItem(this._climKey())) || 0;
      } catch (e) {
        this._climT = 0;
      }
    }
    return this._climT;
  }

  _setClimStart(t) {
    this._climT = t;
    try {
      if (t) localStorage.setItem(this._climKey(), String(t));
      else localStorage.removeItem(this._climKey());
    } catch (e) {}
  }

  _climIsOn() {
    const c = this._eff;
    if (!c.climate_on) return false;
    const s = this._state(c.climate_state);
    if (this._valid(s)) {
      if (this._climPend && Date.now() - this._climPend.t < 15000) return this._climPend.v;
      return s.state !== "off";
    }
    const t = this._climStart();
    return t > 0 && Date.now() - t < (c.climate_timeout || 15) * 60000;
  }

  _toggleClimate() {
    const c = this._eff;
    if (!this._hass || !c.climate_on) return;
    const on = this._climIsOn();
    const target = on ? c.climate_off : c.climate_on;
    if (!target) return;
    this._hass.callService("button", "press", { entity_id: target });
    this._climPend = { v: !on, t: Date.now() };
    this._setClimStart(on ? 0 : Date.now());
    this._render();
  }

  _scheduleClimExpiry() {
    clearTimeout(this._climX);
    const c = this._eff;
    const t = this._climStart();
    if (t > 0 && c.climate_on && !this._valid(this._state(c.climate_state))) {
      const rest = (c.climate_timeout || 15) * 60000 - (Date.now() - t);
      if (rest > 0) this._climX = setTimeout(() => this._render(), rest + 500);
    }
  }

  // Les images choisies dans l'éditeur sont des identifiants media-source://, convertis en URL signée par Home Assistant.
  _img(src) {
    if (!src || !String(src).startsWith("media-source://")) return src || "";
    const m = (this._imgs = this._imgs || {});
    const e = m[src];
    const now = Date.now();
    if (e && e.url && now < e.exp) return e.url;
    if (!(e && e.busy) && !(e && now < e.retry) && this._hass && this._hass.callWS) {
      m[src] = { url: e ? e.url : "", exp: 0, busy: true };
      this._hass
        .callWS({ type: "media_source/resolve_media", media_content_id: src, expires: 6 * 3600 })
        .then((r) => {
          m[src] = { url: r.url, exp: Date.now() + 5 * 3600 * 1000 };
          this._render();
        })
        .catch(() => {
          m[src] = { url: "", exp: 0, retry: Date.now() + 60000 };
        });
    }
    return (m[src] && m[src].url) || "";
  }

  _tabsHtml() {
    if (!this._vlist) return "";
    return `<div class="tabs">${this._vlist
      .map((v, i) => `<button class="tab ${i === this._sel ? "on" : ""}" data-tab="${i}">${esc(v.name || (v.device ? deviceName(this._hass, v.device) : v.location))}</button>`)
      .join("")}</div>`;
  }

  _banner() {
    const c = this._eff;
    const main = this._img(c.image);
    if (main && this._useStack()) {
      const layers = Object.entries(c.open_images)
        .map(([k, srcImg]) => [k, this._img(srcImg)])
        .filter(([, u]) => u)
        .map(([k, u]) => `<img class="layer${(c.doors || {})[k] && this._isOpen(c.doors[k]) ? " on" : ""}" src="${u}" alt="">`)
        .join("");
      return `<div class="banner"><div class="stack"><img src="${main}" alt="${c.name || "Voiture"}">${layers}</div></div>`;
    }
    if (main) return `<div class="banner"><img src="${main}" alt="${c.name || "Voiture"}"></div>`;
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
    const v = isNum ? n.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : FR_STATE[s.state] || (this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state);
    return u && isNum ? `${v} ${FR_UNIT[u] || u}` : v;
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
      return `<div class="bar" data-info="${id}"><div class="top"><span>${label}</span><b class="na">n/d</b></div><div class="track"></div></div>`;
    }
    const pct = Math.max(0, Math.min(100, (n / max) * 100));
    const unit = unitOverride || this._state(id).attributes.unit_of_measurement || "";
    return `<div class="bar" data-info="${id}"><div class="top"><span>${label}</span><b>${Math.round(n)} ${unit}</b></div>
      <div class="track"><div class="fill" style="width:${pct}%;background:${this._color(pct)}"></div></div></div>`;
  }

  _useStack() {
    const c = this._eff;
    return !!(c.image && c.open_images && Object.keys(c.open_images).length);
  }

  _carSvg() {
    const c = this._eff;
    const d = c.doors || {};
    const open = (k) => (d[k] ? this._isOpen(d[k]) : false);
    const body = c.body_color || "var(--primary-color)";
    const edge = "rgba(0,0,0,0.38)";
    const glass = "#3b4a56";
    const dark = "#15191c";
    const red = "var(--error-color)";

    const door = (k, left, y, h, mirror) => {
      const o = open(k);
      const x = left ? 45 : 134;
      const hx = left ? 45 : 155;
      const rot = o ? (left ? 58 : -58) : 0;
      const opening = o ? `<rect x="${left ? 47 : 134}" y="${y}" width="19" height="${h}" rx="4" fill="${dark}" opacity="0.85"/>` : "";
      const mir = mirror ? `<ellipse cx="${left ? 41 : 159}" cy="${y + 1}" rx="7" ry="4.5" fill="${body}" stroke="${o ? red : edge}" stroke-width="1"/>` : "";
      return `${opening}<g transform="rotate(${rot} ${hx} ${y})">
        <rect x="${x}" y="${y}" width="21" height="${h}" rx="5" fill="${body}" stroke="${o ? red : edge}" stroke-width="${o ? 2 : 1}"/>
        <rect x="${left ? 50 : 139}" y="${y + 6}" width="11" height="${h - 12}" rx="3" fill="${glass}"/>
        <rect x="${left ? 47 : 151}" y="${y + h * 0.55}" width="3" height="7" rx="1.5" fill="rgba(255,255,255,0.6)"/>
        ${mir}
      </g>`;
    };

    const hood = open("hood");
    const tail = open("tailgate");
    const hoodSvg = hood
      ? `<rect x="62" y="38" width="76" height="60" rx="12" fill="${dark}" opacity="0.88"/>
         <path d="M58 68 Q100 58 142 68 L146 104 Q100 98 54 104 Z" fill="${body}" stroke="${red}" stroke-width="2"/>`
      : `<path d="M62 36 Q100 24 138 36 L142 100 Q100 94 58 100 Z" fill="rgba(255,255,255,0.10)" stroke="${edge}" stroke-width="1"/>
         <path d="M100 30 L100 96" stroke="${edge}" stroke-width="0.8" opacity="0.5"/>`;
    const tailSvg = tail
      ? `<rect x="68" y="262" width="64" height="44" rx="10" fill="${dark}" opacity="0.88"/>
         <path d="M60 236 Q100 226 140 236 L144 270 Q100 262 56 270 Z" fill="${body}" stroke="${red}" stroke-width="2"/>`
      : `<path d="M64 258 Q100 268 136 258 L140 310 Q100 320 60 310 Z" fill="rgba(255,255,255,0.08)" stroke="${edge}" stroke-width="1"/>`;

    return `<svg viewBox="-30 0 260 340" role="img" aria-label="Voiture vue de dessus">
      <ellipse cx="100" cy="326" rx="64" ry="7" fill="rgba(0,0,0,0.18)"/>
      <rect x="37" y="62" width="11" height="38" rx="5" fill="#1f2428"/>
      <rect x="152" y="62" width="11" height="38" rx="5" fill="#1f2428"/>
      <rect x="37" y="238" width="11" height="38" rx="5" fill="#1f2428"/>
      <rect x="152" y="238" width="11" height="38" rx="5" fill="#1f2428"/>
      <path d="M100 12 C132 12 148 26 151 58 L154 112 L155 232 L152 272 C149 304 132 326 100 328 C68 326 51 304 48 272 L45 232 L46 112 L49 58 C52 26 68 12 100 12 Z" fill="${body}" stroke="${edge}" stroke-width="1.5"/>
      <path d="M58 36 Q70 28 84 30 L80 40 Q68 38 60 46 Z" fill="#ffe082"/>
      <path d="M142 36 Q130 28 116 30 L120 40 Q132 38 140 46 Z" fill="#ffe082"/>
      <path d="M58 300 Q70 308 84 306 L80 298 Q68 300 60 292 Z" fill="#c62828"/>
      <path d="M142 300 Q130 308 116 306 L120 298 Q132 300 140 292 Z" fill="#c62828"/>
      ${hoodSvg}
      <path d="M64 104 Q100 92 136 104 L132 134 Q100 127 68 134 Z" fill="${glass}"/>
      <rect x="67" y="134" width="66" height="96" rx="12" fill="${body}" stroke="${edge}" stroke-width="1"/>
      <rect x="67" y="134" width="66" height="96" rx="12" fill="rgba(255,255,255,0.16)"/>
      <path d="M73 140 L73 224 M127 140 L127 224" stroke="${edge}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M68 230 Q100 237 132 230 L137 256 Q100 266 63 256 Z" fill="${glass}"/>
      ${tailSvg}
      ${door("rear_left", true, 182, 66, false)}
      ${door("rear_right", false, 182, 66, false)}
      ${door("front_left", true, 110, 70, true)}
      ${door("front_right", false, 110, 70, true)}
    </svg>`;
  }

  _render() {
    if (!this._config || !this._hass) return;
    const c = this._eff || (this._eff = this._effective());
    const hasAnything = c.location || c.battery || c.fuel || c.lock || c.odometer || Object.keys(c.doors).length || c.stats.length;
    if (!hasAnything) {
      this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card><div class="empty">${
        this._config.device ? "Aucune entité détectée pour ce véhicule. Choisis-les à la main dans l'éditeur." : "Choisis un véhicule dans l'éditeur de la carte."
      }</div></ha-card>`;
      return;
    }

    const loc = this._state(c.location);
    const locTxt = loc && this._valid(loc) ? FR_STATE[loc.state] || loc.state : "";

    const chips = [];
    if (c.lock && this._state(c.lock)) {
      const s = this._state(c.lock);
      if (!this._valid(s)) {
        chips.push(`<div class="chip off" data-info="${c.lock}"><ha-icon icon="mdi:lock-question"></ha-icon>Verrou indisponible</div>`);
      } else {
        const locked = c.lock.startsWith("lock.") ? s.state === "locked" : s.state === "off";
        chips.push(`<div class="chip ${locked ? "ok" : "warn"}" data-info="${c.lock}"><ha-icon icon="mdi:${locked ? "lock" : "lock-open"}"></ha-icon>${locked ? "Verrouillée" : "Déverrouillée"}</div>`);
      }
    }
    if (c.charging && this._state(c.charging)) {
      const s = this._state(c.charging);
      let t;
      if (!this._valid(s)) t = "Charge indisponible";
      else if (c.charging.startsWith("binary_sensor.")) t = s.state === "on" ? "En charge" : "Pas en charge";
      else t = "Charge : " + this._fmt(c.charging).toLowerCase();
      chips.push(`<div class="chip ${this._valid(s) ? "" : "off"}" data-info="${c.charging}"><ha-icon icon="mdi:ev-plug-type2"></ha-icon>${t}</div>`);
    }
    if (c.engine && this._state(c.engine)) {
      const s = this._state(c.engine);
      chips.push(
        this._valid(s)
          ? `<div class="chip" data-info="${c.engine}"><ha-icon icon="mdi:engine"></ha-icon>${s.state === "on" ? "Moteur allumé" : "Moteur éteint"}</div>`
          : `<div class="chip off" data-info="${c.engine}"><ha-icon icon="mdi:engine"></ha-icon>Moteur indisponible</div>`
      );
    }
    if (c.climate_on && this._climIsOn()) chips.push(`<div class="chip ok"${c.climate_state ? ` data-info="${c.climate_state}"` : ""}><ha-icon icon="mdi:air-conditioner"></ha-icon>Clim en marche</div>`);
    const names = { front_left: "Porte avant gauche", front_right: "Porte avant droite", rear_left: "Porte arrière gauche", rear_right: "Porte arrière droite", tailgate: "Coffre", hood: "Capot" };
    for (const k of Object.keys(c.doors || {})) {
      if (this._isOpen(c.doors[k])) chips.push(`<div class="chip warn" data-info="${c.doors[k]}"><ha-icon icon="mdi:car-door"></ha-icon>${names[k] || k}</div>`);
    }
    for (const w of c.windows || []) {
      const id = typeof w === "string" ? w : w.entity;
      const nm = typeof w === "string" ? id : w.name || id;
      if (this._isOpen(id)) chips.push(`<div class="chip warn" data-info="${id}"><ha-icon icon="mdi:window-open-variant"></ha-icon>${nm}</div>`);
    }

    const statList = [
      ...(c.odometer ? [{ entity: c.odometer, name: "Kilométrage", icon: "mdi:counter" }] : []),
      ...(c.consumption_fuel ? [{ entity: c.consumption_fuel, name: "Conso essence", icon: "mdi:gas-station" }] : []),
      ...(c.consumption_electric ? [{ entity: c.consumption_electric, name: "Conso électrique", icon: "mdi:lightning-bolt" }] : []),
      ...(c.stats || []),
    ];
    const stats = statList
      .map((s) => `<div class="stat" data-info="${s.entity}"><div class="l">${s.icon ? `<ha-icon icon="${s.icon}"></ha-icon>` : ""}${s.name || s.entity}</div><div class="v ${this._valid(this._state(s.entity)) ? "" : "na"}">${this._fmt(s.entity)}</div></div>`)
      .join("");

    const acts = (c.actions || [])
      .map((a) => {
        if (a.climate) {
          if (!c.climate_on) return "";
          const on = this._climIsOn();
          const tgt = this._state(on ? c.climate_off || c.climate_on : c.climate_on);
          const dis = !tgt || tgt.state === "unavailable";
          return `<button class="act ${on ? "on" : ""}" data-climate="1" ${dis ? "disabled" : ""}><ha-icon icon="${on ? "mdi:snowflake-off" : "mdi:air-conditioner"}"></ha-icon>${on ? "Couper la clim" : "Activer la clim"}</button>`;
        }
        const st = this._state(a.entity);
        const dis = !st || st.state === "unavailable";
        const armed = this._armed === a.entity;
        return `<button class="act ${armed ? "armed" : ""}" data-entity="${a.entity}" ${a.confirm ? 'data-confirm="1"' : ""} ${dis ? "disabled" : ""}><ha-icon icon="${a.icon || "mdi:gesture-tap"}"></ha-icon>${armed ? "Confirmer ?" : a.name || a.entity}</button>`;
      })
      .join("");

    const unit = this._state(c.fuel) && this._state(c.fuel).attributes.unit_of_measurement;
    const fuelMax = c.fuel_max || (unit === "%" ? 100 : 70);
    const hasPos = this._hasPosition();
    const mapBlock =
      c.map !== false && c.location
        ? `<div class="map" id="map"><div id="mapslot">${hasPos ? "" : '<div class="nomap">Position indisponible</div>'}</div>${c.address !== false && hasPos ? `<div class="addr" id="addr">${this._addressHtml()}</div>` : ""}${hasPos ? `<a class="nav" id="nav" target="_blank" rel="noopener" title="Itinéraire" href="${this._navUrl()}"><ha-icon icon="mdi:navigation-variant"></ha-icon></a>` : ""}</div>`
        : "";

    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
    <ha-card>
      ${this._tabsHtml()}
      <div class="head"><div class="name">${c.name || "Voiture"}</div>${locTxt ? `<div class="loc" data-info="${c.location}"><ha-icon icon="mdi:map-marker" style="--mdc-icon-size:14px"></ha-icon>${locTxt}</div>` : ""}</div>
      ${c.show_banner !== false ? this._banner() : ""}
      <div class="hero">
        ${c.show_top_view ?? !this._useStack() ? `<div class="car">${this._carSvg()}</div>` : ""}
        <div class="bars">
          ${this._bar("Batterie", c.battery, 100, "%")}
          ${this._bar("Carburant", c.fuel, fuelMax)}
          ${c.range_electric ? `<div class="bar" data-info="${c.range_electric}"><div class="top"><span>Autonomie électrique</span><b>${this._fmt(c.range_electric)}</b></div></div>` : ""}
          ${c.range_fuel ? `<div class="bar" data-info="${c.range_fuel}"><div class="top"><span>Autonomie essence</span><b>${this._fmt(c.range_fuel)}</b></div></div>` : ""}
        </div>
      </div>
      ${c.show_chips !== false && chips.length ? `<div class="chips">${chips.join("")}</div>` : ""}
      ${mapBlock}
      ${c.show_stats !== false && stats ? `<div class="stats">${stats}</div>` : ""}
      ${c.show_actions !== false && acts ? `<div class="acts">${acts}</div>` : ""}
    </ha-card>`;
    this._ensureMap();
    this._updateAddress();
    this._scheduleClimExpiry();
  }
}

/* ------------------------------------------------------------------ */
/* Éditeur visuel                                                     */
/* ------------------------------------------------------------------ */

const LABELS = {
  device: "Véhicule détecté",
  name: "Nom affiché",
  image: "Photo de la voiture (choisir dans les médias)",
  oi_front_left: "Porte avant gauche ouverte",
  oi_front_right: "Porte avant droite ouverte",
  oi_rear_left: "Porte arrière gauche ouverte",
  oi_rear_right: "Porte arrière droite ouverte",
  oi_tailgate: "Coffre ouvert",
  oi_hood: "Capot ouvert",
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
  map_theme: "Style du plan",
  map_all_vehicles: "Afficher tous les véhicules détectés sur le plan",
  map_extra: "Autres positions à afficher sur le plan",
  vehicles: "Plusieurs véhicules dans la même carte (onglets)",
  show_address: "Afficher l'adresse sur le plan",
  address: "Capteur d'adresse (détecté par défaut)",
  geocode: "Chercher l'adresse via OpenStreetMap si aucun capteur",
  odometer: "Kilométrage",
  consumption_fuel: "Consommation essence",
  consumption_electric: "Consommation électrique",
  climate_on: "Bouton : démarrer la clim",
  climate_off: "Bouton : couper la clim",
  climate_state: "État de la clim (facultatif)",
  climate_timeout: "Durée de la clim sans état (minutes)",
};

const EDITOR_DEFAULTS = { map: true, show_address: true, geocode: false, map_theme: "light", map_all_vehicles: true, show_banner: true, show_chips: true, show_stats: true, show_actions: true, map_zoom: 15, body_color: "theme", device: "none" };

const MEDIA = { media: { accept: ["image/*"] } };
const OI_KEYS = ["front_left", "front_right", "rear_left", "rear_right", "tailgate", "hood"];

const MAP_THEMES = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "auto", label: "Selon le thème" },
];

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
  ["address", "Adresse", "mdi:map-marker-radius"],
  ["odometer", "Kilométrage", "mdi:counter"],
  ["consumption_fuel", "Conso essence", "mdi:gas-station"],
  ["consumption_electric", "Conso électrique", "mdi:lightning-bolt"],
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
      { name: "vehicles", selector: { select: { multiple: true, options: options.filter((o) => o.value !== "none"), mode: "dropdown" } } },
      { name: "name", selector: { text: {} } },
      { name: "image", selector: MEDIA },
      {
        type: "expandable",
        name: "",
        title: "Photos avec une ouverture (facultatif)",
        flatten: true,
        schema: OI_KEYS.map((k) => ({ name: "oi_" + k, selector: MEDIA })),
      },
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
      { name: "map_theme", selector: { select: { options: MAP_THEMES, mode: "dropdown" } } },
      { name: "show_address", selector: { boolean: {} } },
      { name: "map_all_vehicles", selector: { boolean: {} } },
      { name: "map_extra", selector: { entity: { domain: "device_tracker", multiple: true } } },
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
          entity("climate_on", "button"),
          entity("climate_off", "button"),
          entity("climate_state", ["binary_sensor", "switch", "climate"]),
          { name: "climate_timeout", selector: { number: { min: 1, max: 60, step: 1, mode: "box", unit_of_measurement: "min" } } },
          entity("address", "sensor"),
          { name: "geocode", selector: { boolean: {} } },
          entity("odometer", "sensor"),
          entity("consumption_fuel", "sensor"),
          entity("consumption_electric", "sensor"),
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
    this._form.data = this._formData(this._config);
    this._form.schema = this._schema(vehicles);
    this._form.computeLabel = (s) => LABELS[s.name] || s.name;
    this._renderDetected();
  }

  _formData(cfg) {
    const d = { ...EDITOR_DEFAULTS, ...cfg };
    d.vehicles = Array.isArray(cfg.vehicles) ? cfg.vehicles.map((x) => (typeof x === "string" ? x : x.device)).filter(Boolean) : [];
    const asMedia = (u) => (u ? { media_content_id: u, media_content_type: "image/*" } : undefined);
    d.image = asMedia(cfg.image);
    for (const k of OI_KEYS) d["oi_" + k] = asMedia((cfg.open_images || {})[k]);
    delete d.open_images;
    return d;
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
      row("mdi:air-conditioner", "Climatisation (bouton unique)", d.climate_on && d.climate_off ? (d.climate_state ? "avec état" : "sans état") : "") +
      row("mdi:view-grid", "Tuiles d'infos", d.stats.length ? `${d.stats.length} trouvée(s)` : "") +
      row("mdi:gesture-tap-button", "Boutons d'action", d.actions.length ? `${d.actions.length} trouvé(s)` : "");
  }

  _changed(ev) {
    ev.stopPropagation();
    const prev = this._config;
    const v = { ...prev, ...ev.detail.value };
    if (prev.vehicles === "auto" && !(ev.detail.value.vehicles || []).length) v.vehicles = "auto";
    else if (Array.isArray(ev.detail.value.vehicles)) {
      const old = Array.isArray(prev.vehicles) ? prev.vehicles : [];
      const sel = ev.detail.value.vehicles;
      const same = old.map((x) => (typeof x === "string" ? x : x.device)).join() === sel.join();
      v.vehicles = same ? old : sel.map((id) => old.find((x) => typeof x === "object" && x.device === id) || id);
      if (!v.vehicles.length) delete v.vehicles;
    }
    const idOf = (m) => (m && typeof m === "object" ? m.media_content_id || "" : m || "");
    v.image = idOf(v.image);
    const oi = {};
    for (const k of OI_KEYS) {
      const u = idOf(v["oi_" + k]);
      if (u) oi[k] = u;
      delete v["oi_" + k];
    }
    if (Object.keys(oi).length) v.open_images = oi;
    else delete v.open_images;
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
    this._form.data = this._formData(v);
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
