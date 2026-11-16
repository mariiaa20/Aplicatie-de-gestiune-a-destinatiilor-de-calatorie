import { useWikiPhoto } from "../hooks/useWikiPhoto.js";
import styles from "./DestinationPhoto.module.css";

// Shows the user's own photo if there is one, otherwise looks one up on Wikipedia
export default function DestinationPhoto({ title, photo }) {
  const auto = useWikiPhoto(title, !photo);

  if (photo) {
    return (
      <figure className={styles.destPhoto}>
        <img src={photo} alt={title} />
      </figure>
    );
  }

  if (auto.status === "loading") {
    return <div className={`${styles.destPhoto} ${styles.destPhotoLoading}`} aria-hidden="true" />;
  }

  if (auto.status === "found") {
    return (
      <figure className={styles.destPhoto}>
        <img src={auto.photo.url} alt={title} loading="lazy" />
        <figcaption>
          <a href={auto.photo.pageUrl} target="_blank" rel="noreferrer">
            Photo: Wikipedia
          </a>
        </figcaption>
      </figure>
    );
  }

  return null;
}