import { useWikiPhoto } from "../hooks/useWikiPhoto.js";

// Small round photo shown before the destination name
export default function DestinationAvatar({ title, photo }) {
  const auto = useWikiPhoto(title, !photo);
  const src = photo || (auto.status === "found" ? auto.photo.url : "");

  if (src) {
    return <img className="dest-avatar" src={src} alt="" />;
  }

  if (auto.status === "loading") {
    return <span className="dest-avatar dest-avatar-loading" aria-hidden="true" />;
  }

  return (
    <span className="dest-avatar dest-avatar-letter" aria-hidden="true">
      {title.trim().charAt(0).toUpperCase()}
    </span>
  );
}