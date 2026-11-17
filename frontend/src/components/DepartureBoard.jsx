import { useEffect, useRef, useState } from "react";
import { BOARD_CHARS } from "../utils/departures.js";
import { playFlap } from "../utils/flapSound.js";
import styles from "./DepartureBoard.module.css";

// how many letters each column has on the board
const COLUMNS = [
  { key: "time", label: "Time", width: 5, className: styles.colTime },
  { key: "destination", label: "Destination", width: 20, className: styles.colDestination },
  { key: "gate", label: "Gate", width: 3, className: styles.colGate },
  { key: "remark", label: "Remarks", width: 9, className: styles.colRemark }
];
const ROW_LENGTH = COLUMNS.reduce((sum, column) => sum + column.width, 0);
const TICK_MS = 45; // one flap every 45 ms, like a real board

// one line of the board as a single text, every column padded to its width
function lineOf(row) {
  return COLUMNS.map((column) =>
    String(row?.[column.key] ?? "").toUpperCase().slice(0, column.width).padEnd(column.width, " ")
  ).join("");
}

function charIndex(char) {
  const index = BOARD_CHARS.indexOf(char);
  return index === -1 ? 0 : index;
}

// A split-flap departure board. Give it rows; when they change, every letter
// turns through the alphabet until it reaches the new one, and onSettled is
// called when the whole board has stopped.
// rows: [{ time, destination, gate, remark }], the first one is the next departure
// rollKey: change it to make the board turn again, even towards the same letters
export default function DepartureBoard({ rows, lines = 6, highlight = false, sound = false, rollKey = 0, onSettled }) {
  // the letters on screen live in a ref and change on every tick;
  // the state is only a counter that tells React to draw them again
  const cellsRef = useRef(null);
  const [, setTick] = useState(0);
  const settledRef = useRef(onSettled);
  const soundRef = useRef(sound);
  settledRef.current = onSettled;
  soundRef.current = sound;

  if (cellsRef.current === null) {
    cellsRef.current = Array.from({ length: lines * ROW_LENGTH }, () => ({ char: " ", target: " ", steps: 0, min: 0 }));
  }

  // the clock in the corner of the board
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const target = Array.from({ length: lines }, (_, i) => lineOf(rows[i])).join("");

  useEffect(() => {
    const cells = cellsRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cells.forEach((cell, index) => {
      cell.target = target[index];
      cell.steps = 0;
      // the columns start a little one after the other, like a wave from left to right
      cell.min = reduceMotion ? 0 : 3 + Math.floor(Math.random() * 8) + Math.floor((index % ROW_LENGTH) / 3);
      if (reduceMotion) cell.char = cell.target;
    });

    let timer = null;
    function tick() {
      let moving = 0;
      for (const cell of cells) {
        if (cell.char === cell.target && cell.steps >= cell.min) continue;
        cell.char = BOARD_CHARS[(charIndex(cell.char) + 1) % BOARD_CHARS.length];
        cell.steps += 1;
        moving += 1;
      }
      if (moving > 0) {
        if (soundRef.current) playFlap(moving / 40);
        setTick((n) => n + 1);
      } else {
        clearInterval(timer);
        settledRef.current?.();
      }
    }

    if (reduceMotion) {
      setTick((n) => n + 1);
      settledRef.current?.();
      return undefined;
    }
    timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, [target, rollKey]);

  const cells = cellsRef.current;

  return (
    <div className={styles.board} role="img" aria-label={rows.map((row) => `${row.time} ${row.destination}`).join(", ")}>
      <div className={styles.boardHead}>
        <span className={styles.boardTitle}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          Departures
        </span>
        <span className={styles.clock}>
          {String(clock.getHours()).padStart(2, "0")}
          <span className={styles.colon}>:</span>
          {String(clock.getMinutes()).padStart(2, "0")}
        </span>
      </div>

      <div className={styles.labels} aria-hidden="true">
        {COLUMNS.map((column) => (
          <span key={column.key} className={column.className} style={{ "--chars": column.width }}>
            {column.label}
          </span>
        ))}
      </div>

      {Array.from({ length: lines }, (_, line) => {
        let offset = line * ROW_LENGTH;
        const isPick = highlight && line === 0;
        return (
          <div key={line} className={isPick ? `${styles.line} ${styles.picked}` : styles.line} aria-hidden="true">
            {COLUMNS.map((column) => {
              const start = offset;
              offset += column.width;
              return (
                <span key={column.key} className={column.className} style={{ "--chars": column.width }}>
                  {cells.slice(start, start + column.width).map((cell, i) => (
                    <span key={i} className={styles.cell}>
                      {/* a new key on every step, so the flap falls again */}
                      <span key={cell.steps} className={cell.steps ? `${styles.flap} ${styles.falling}` : styles.flap}>
                        {cell.char === " " ? " " : cell.char}
                      </span>
                    </span>
                  ))}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
