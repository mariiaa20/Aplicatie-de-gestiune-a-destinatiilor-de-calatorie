import { useEffect, useMemo, useRef, useState } from "react";
import {
  geoBounds,
  geoContains,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath
} from "d3-geo";
import { feature } from "topojson-client";
import world110 from "world-atlas/countries-110m.json";
import world50 from "world-atlas/countries-50m.json";
import { useWikiCoordinates } from "../hooks/useWikiPhoto.js";
import { BookPage } from "./PassportBook.jsx";

const SIZE = 440;
const RADIUS = SIZE / 2 - 6;
const SPIN_SPEED = 5;   // degrees per second
const FLY_MS = 1400;    // how long the globe takes to fly to a place
const DRAG_SPEED = 0.35;
const MAX_TILT = 70;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const FOCUS_ZOOM = 2.4; // zoom used when flying to a place
const DETAIL_ZOOM = 2;  // from here on, the detailed map is drawn

// Light map for the land, drawn on every frame while the globe turns.
// Detailed map for finding and hatching countries, and for the land when zoomed in:
// it also has small islands, like the Maldives.
const LAND = feature(world110, world110.objects.countries).features;
const DETAILED = feature(world50, world50.objects.countries).features.map((country) => ({
  country,
  bounds: geoBounds(country)
}));
const DETAILED_LAND = DETAILED.map((d) => d.country);
const GRATICULE = geoGraticule10();
const SPHERE = { type: "Sphere" };

const countryKey = (country) => country.id ?? country.properties.name;
const clampTilt = (phi) => Math.max(-MAX_TILT, Math.min(MAX_TILT, phi));
const clampZoom = (z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// the shortest way round, so the globe never spins almost a full turn
const shortestTurn = (delta) => ((((delta + 180) % 360) + 360) % 360) - 180;

// Quick test before the exact one: is the point inside the country's bounding box?
function inBounds([[west, south], [east, north]], [lon, lat]) {
  if (lat < south || lat > north) return false;
  // a country that crosses the 180° line has west > east
  return west <= east ? lon >= west && lon <= east : lon >= west || lon <= east;
}

// The place itself, then points around it: the map draws islands and coasts
// a little simplified, so a harbour can fall just outside its country
function pointsAround([lon, lat]) {
  const points = [[lon, lat]];
  for (const r of [0.3, 0.7]) {
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      points.push([lon + r * Math.cos(rad), lat + r * Math.sin(rad)]);
    }
  }
  return points;
}

const countryCache = new Map();

function findCountry(point) {
  const key = point.join(",");
  if (countryCache.has(key)) return countryCache.get(key);

  let found = null;
  for (const p of pointsAround(point)) {
    const hit = DETAILED.find(({ country, bounds }) => inBounds(bounds, p) && geoContains(country, p));
    if (hit) {
      found = hit.country;
      break;
    }
  }
  countryCache.set(key, found);
  return found;
}

// Unique countries, in the order of the destinations
function uniqueCountries(places) {
  const seen = new Map();
  for (const place of places) {
    if (place.country) seen.set(countryKey(place.country), place.country);
  }
  return [...seen.values()];
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// firstPage: the number printed on the globe page; the notes page gets the next one
export default function TravelGlobe({ destinations, onToggle, firstPage = 4 }) {
  const [rotation, setRotation] = useState([-15, -30]);
  const [zoom, setZoom] = useState(1);
  const [newKey, setNewKey] = useState(null); // the country that glows for a moment

  const svgRef = useRef(null);
  const rotationRef = useRef(rotation);
  const zoomRef = useRef(zoom);
  const holdRef = useRef({ hover: false, drag: false, fly: false }); // reasons to stop spinning
  const pointersRef = useRef(new Map()); // fingers or mouse currently pressed on the globe
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const flyRef = useRef({ frame: 0, timer: 0, glow: 0 });
  const prevVisitedRef = useRef(null);

  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    rotationRef.current = rotation;
    zoomRef.current = zoom;
  }, [rotation, zoom]);

  const coords = useWikiCoordinates(destinations.map((d) => d.title));

  // Every destination that has a location: its point [lon, lat] and its country.
  // lat and lon written in db.json win over the ones found on Wikipedia.
  const placed = useMemo(
    () =>
      destinations
        .map((d) => {
          const own = typeof d.lat === "number" && typeof d.lon === "number";
          const where = own ? { lat: d.lat, lon: d.lon } : coords[d.title.trim()];
          if (!where) return null;
          const point = [where.lon, where.lat];
          return { ...d, point, country: findCountry(point) };
        })
        .filter(Boolean),
    [destinations, coords]
  );
  const placeById = new Map(placed.map((p) => [p.id, p]));

  const visitedCountries = uniqueCountries(placed.filter((p) => p.visited));
  const visitedKeys = new Set(visitedCountries.map(countryKey));
  const plannedCountries = uniqueCountries(placed.filter((p) => !p.visited)).filter(
    (c) => !visitedKeys.has(countryKey(c))
  );
  // destinations for which Wikipedia answered, but without a location
  const notFound = destinations.filter(
    (d) => typeof d.lat !== "number" && coords[d.title.trim()] === null
  ).length;

  // Slow spin, only at normal size, and paused while the pointer is on the globe,
  // while dragging and while flying
  useEffect(() => {
    if (reducedMotion) return;
    let frame;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const hold = holdRef.current;
      if (!hold.hover && !hold.drag && !hold.fly && zoomRef.current <= 1.01) {
        setRotation(([lambda, phi]) => [lambda + SPIN_SPEED * dt, phi]);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  function stopFlight() {
    cancelAnimationFrame(flyRef.current.frame);
    clearTimeout(flyRef.current.timer);
    holdRef.current.fly = false;
  }

  // Moves the globe smoothly to a rotation and a zoom
  function animateView([toL, toP], toZoom, duration, onDone) {
    stopFlight();
    const [startL, startP] = rotationRef.current;
    const startZ = zoomRef.current;
    const deltaL = shortestTurn(toL - startL);

    if (reducedMotion) {
      setRotation([startL + deltaL, toP]);
      setZoom(toZoom);
      onDone?.();
      return;
    }

    holdRef.current.fly = true;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = easeInOut(t);
      setRotation([startL + deltaL * e, startP + (toP - startP) * e]);
      setZoom(startZ + (toZoom - startZ) * e);
      if (t < 1) {
        flyRef.current.frame = requestAnimationFrame(step);
      } else if (onDone) {
        onDone();
      } else {
        holdRef.current.fly = false;
      }
    };
    flyRef.current.frame = requestAnimationFrame(step);
  }

  // Flies to a place and zooms in, then makes its country glow
  function flyTo(place) {
    const key = place.country ? countryKey(place.country) : null;
    clearTimeout(flyRef.current.glow);
    setNewKey(key);
    flyRef.current.glow = setTimeout(() => setNewKey(null), 3600);

    const [lon, lat] = place.point;
    animateView([-lon, clampTilt(-lat)], Math.max(zoomRef.current, FOCUS_ZOOM), FLY_MS, () => {
      // stay still a moment on the place
      flyRef.current.timer = setTimeout(() => {
        holdRef.current.fly = false;
      }, 2500);
    });
  }

  function resetView() {
    animateView([rotationRef.current[0], -30], 1, 700);
  }

  function zoomBy(factor) {
    stopFlight();
    setZoom((z) => clampZoom(z * factor));
  }

  // When a destination becomes visited, fly to it. Not on the first render,
  // so opening the page does not jump to a country.
  const visitedIds = destinations
    .filter((d) => d.visited)
    .map((d) => String(d.id))
    .join(",");

  useEffect(() => {
    const now = new Set(visitedIds ? visitedIds.split(",") : []);
    const before = prevVisitedRef.current;
    prevVisitedRef.current = now;
    if (!before) return;

    const newId = [...now].find((id) => !before.has(id));
    const place = newId && placed.find((p) => String(p.id) === newId);
    if (place) flyTo(place);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitedIds]);

  // Mouse wheel zoom. Added by hand, because React's onWheel cannot stop
  // the page from scrolling at the same time.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e) => {
      e.preventDefault();
      stopFlight();
      setZoom((z) => clampZoom(z * Math.exp(-e.deltaY * 0.0015)));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up the timers if the page changes in the middle of a flight
  useEffect(() => {
    const fly = flyRef.current;
    return () => {
      cancelAnimationFrame(fly.frame);
      clearTimeout(fly.timer);
      clearTimeout(fly.glow);
    };
  }, []);

  // One pointer drags the globe, two fingers pinch to zoom
  function handlePointerDown(e) {
    stopFlight();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pointers = pointersRef.current;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    holdRef.current.drag = true;

    if (pointers.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, rotation: rotationRef.current };
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchRef.current = { distance: distance(a, b), zoom: zoomRef.current };
      dragRef.current = null;
    }
  }

  function handlePointerMove(e) {
    const pointers = pointersRef.current;
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinchRef.current && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const pinch = pinchRef.current;
      setZoom(clampZoom((pinch.zoom * distance(a, b)) / pinch.distance));
      return;
    }

    const drag = dragRef.current;
    if (!drag) return;
    const speed = DRAG_SPEED / zoomRef.current; // slower when zoomed in, so the map follows the finger
    const [lambda, phi] = drag.rotation;
    setRotation([
      lambda + (e.clientX - drag.x) * speed,
      clampTilt(phi - (e.clientY - drag.y) * speed)
    ]);
  }

  function handlePointerUp(e) {
    const pointers = pointersRef.current;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchRef.current = null;
    if (pointers.size === 1) {
      // one finger left after a pinch: go on dragging from where it is
      const [p] = [...pointers.values()];
      dragRef.current = { x: p.x, y: p.y, rotation: rotationRef.current };
    }
    if (pointers.size === 0) {
      dragRef.current = null;
      holdRef.current.drag = false;
    }
  }

  const projection = geoOrthographic()
    .scale(RADIUS * zoom)
    .translate([SIZE / 2, SIZE / 2])
    .rotate(rotation);
  const path = geoPath(projection);
  const center = [-rotation[0], -rotation[1]];
  const land = zoom >= DETAIL_ZOOM ? DETAILED_LAND : LAND;

  // two pages of the passport: the globe on the left, its notes on the right
  return (
    <>
      <BookPage number={firstPage} className="globe-page-stage">
        <div className="globe-stage">
          <svg
            ref={svgRef}
            className="globe-svg"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Globe with ${visitedCountries.length} visited countries`}
            onPointerEnter={() => (holdRef.current.hover = true)}
            onPointerLeave={() => (holdRef.current.hover = false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              {/* the hatching: thin diagonal stripes */}
              <pattern
                id="globe-hatch"
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="5" height="5" className="globe-hatch-bg" />
                <rect width="2" height="5" className="globe-hatch-line" />
              </pattern>
              <radialGradient id="globe-shine" cx="35%" cy="28%" r="75%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path d={path(SPHERE)} className="globe-ocean" />
            <path d={path(GRATICULE)} className="globe-graticule" />

            {land.map((country) => (
              <path key={countryKey(country)} d={path(country)} className="globe-land" />
            ))}

            {plannedCountries.map((country) => (
              <path key={countryKey(country)} d={path(country)} className="globe-planned" />
            ))}

            {visitedCountries.map((country) => {
              const key = countryKey(country);
              return (
                <path
                  key={key}
                  d={path(country)}
                  className={key === newKey ? "globe-visited is-new" : "globe-visited"}
                  fill="url(#globe-hatch)"
                >
                  <title>{country.properties.name}</title>
                </path>
              );
            })}

            {placed.map((place) => {
              // a place on the far side of the globe is not drawn
              if (geoDistance(place.point, center) > Math.PI / 2 - 0.04) return null;
              const [x, y] = projection(place.point);
              return (
                <g
                  key={place.id}
                  className={place.visited ? "globe-pin is-visited" : "globe-pin"}
                  transform={`translate(${x} ${y})`}
                >
                  {place.visited && <circle r="9" className="globe-pin-halo" />}
                  <circle r="5" className="globe-pin-dot" />
                  <title>{place.title}</title>
                </g>
              );
            })}

            <path d={path(SPHERE)} className="globe-shine" fill="url(#globe-shine)" />
            <path d={path(SPHERE)} className="globe-outline" />
          </svg>

          <div className="globe-controls">
            <button
              type="button"
              className="globe-control"
              onClick={() => zoomBy(1.4)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="globe-control"
              onClick={() => zoomBy(1 / 1.4)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className="globe-control"
              onClick={resetView}
              aria-label="Back to the whole globe"
              title="Back to the whole globe"
            >
              ⟲
            </button>
          </div>
        </div>
      </BookPage>

      <BookPage number={firstPage + 1}>
        <div className="globe-info">
          <h2 className="card-title">Your travel globe</h2>
          <p className="globe-lead">
            Tick a place and its country gets hatched. Click a name to fly there, drag to turn
            the globe, scroll or pinch to zoom.
          </p>

          <div className="globe-stats">
            <div className="globe-stat">
              <span className="globe-stat-value">{visitedCountries.length}</span>
              <span className="globe-stat-label">
                {visitedCountries.length === 1 ? "country visited" : "countries visited"}
              </span>
            </div>
            <div className="globe-stat">
              <span className="globe-stat-value">{plannedCountries.length}</span>
              <span className="globe-stat-label">still on the wish list</span>
            </div>
          </div>

          {visitedCountries.length > 0 && (
            <ul className="globe-chips" aria-label="Visited countries">
              {visitedCountries.map((country) => {
                const key = countryKey(country);
                return (
                  <li key={key} className={key === newKey ? "chip globe-chip is-new" : "chip globe-chip"}>
                    {country.properties.name}
                  </li>
                );
              })}
            </ul>
          )}

          {destinations.length > 0 && (
            <ul className="globe-places" aria-label="Your destinations">
              {destinations.map((d) => {
                const place = placeById.get(d.id);
                const lookedUp = typeof d.lat === "number" || coords[d.title.trim()] !== undefined;
                const where = place?.country?.properties.name ?? (lookedUp ? "not found" : "looking…");
                return (
                  <li key={d.id} className={d.visited ? "globe-place is-visited" : "globe-place"}>
                    <input
                      type="checkbox"
                      className="card-check"
                      checked={d.visited}
                      onChange={() => onToggle(d.id)}
                      aria-label={`Mark ${d.title} as visited`}
                    />
                    <button
                      type="button"
                      className="globe-place-button"
                      onClick={() => place && flyTo(place)}
                      disabled={!place}
                    >
                      <span className="globe-place-name">{d.title}</span>
                      <span className="globe-place-country">{where}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <ul className="globe-legend">
            <li>
              <span className="legend-swatch swatch-visited" aria-hidden="true" />
              Visited country
            </li>
            <li>
              <span className="legend-swatch swatch-planned" aria-hidden="true" />
              Planned country
            </li>
            <li>
              <span className="legend-dot dot-visited" aria-hidden="true" />
              Visited place
            </li>
            <li>
              <span className="legend-dot dot-planned" aria-hidden="true" />
              Planned place
            </li>
          </ul>

          {notFound > 0 && (
            <p className="globe-note">
              {notFound === 1
                ? "1 destination is not on the globe: no location was found for its name on Wikipedia."
                : `${notFound} destinations are not on the globe: no location was found for their names on Wikipedia.`}
            </p>
          )}
        </div>
      </BookPage>
    </>
  );
}
