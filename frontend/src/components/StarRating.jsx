import { useState } from "react";

export default function StarRating({ value = 0, onChange, label = "Your rating" }) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      className="star-rating"
      role="group"
      aria-label={label}
      onMouseLeave={() => setHovered(0)}
    >
      <span className="star-rating-label">{label}</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= shown ? "star-btn filled" : "star-btn"}
          aria-label={`${star} out of 5 stars`}
          aria-pressed={star === value}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star === value ? 0 : star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}