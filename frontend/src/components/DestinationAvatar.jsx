import { useWikiPhoto } from "../hooks/useWikiPhoto.js";
import styles from "./DestinationAvatar.module.css";

// Small round photo shown before the destination name
export default function DestinationAvatar({ title, photo }) {
  const auto = useWikiPhoto(title, !photo);
  const src = photo || (auto.status === "found" ? auto.photo.url : "");

  if (src) {
    return <img className={styles.destAvatar} src={src} alt="" />;
  }

  if (auto.status === "loading") {
    return <span className={`${styles.destAvatar} ${styles.destAvatarLoading}`} aria-hidden="true" />;
  }

  return (
    <span className={`${styles.destAvatar} ${styles.destAvatarLetter}`} aria-hidden="true">
      {title.trim().charAt(0).toUpperCase()}
    </span>
  );
}