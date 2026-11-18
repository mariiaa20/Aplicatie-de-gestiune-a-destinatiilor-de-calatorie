import { useEffect, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext.js";
import styles from "./UndoToast.module.css";

const SHOW_MS = 7000; // how long "Undo" stays on screen

// "Lisbon deleted. Undo" at the bottom of the page, for a few seconds after a delete
export default function UndoToast({ deleted, onUndo, onClose }) {
  const { t } = useLanguage();
  // the latest onClose, so the timer does not start again on every render
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // a new delete starts a new countdown
  useEffect(() => {
    if (!deleted) return undefined;
    const timer = setTimeout(() => closeRef.current(), SHOW_MS);
    return () => clearTimeout(timer);
  }, [deleted]);

  if (!deleted) return null;

  return (
    <div className={styles.toast} role="status" key={deleted.item.id}>
      <span>
        {t.undo.before}
        <strong>{deleted.item.title}</strong>
        {t.undo.after}
      </span>
      <button type="button" className={styles.undo} onClick={onUndo}>
        {t.undo.undo}
      </button>
      <button type="button" className={styles.close} onClick={onClose} aria-label={t.undo.close}>
        ×
      </button>
      {/* the line that runs out while the message is on screen */}
      <span className={styles.timer} style={{ animationDuration: `${SHOW_MS}ms` }} aria-hidden="true" />
    </div>
  );
}
