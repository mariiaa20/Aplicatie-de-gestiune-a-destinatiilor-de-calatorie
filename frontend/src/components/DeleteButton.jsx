// Round icon button. The lid tilts open on hover (see .bin-lid in App.css).
// The name goes in aria-label, because the icon alone says nothing to a screen reader.
export default function DeleteButton({ label, onDelete, small = false }) {
  return (
    <button
      type="button"
      className={small ? "btn-delete btn-delete-small" : "btn-delete"}
      aria-label={`Delete ${label}`}
      title={`Delete ${label}`}
      onClick={(event) => {
        event.stopPropagation(); // the table row toggles on click
        onDelete();
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <g className="bin-lid">
          <path d="M4 7h16" />
          <path d="M10 4.5h4" />
        </g>
        <path d="M6.5 7.5 7.4 19a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9L17.5 7.5" />
        <path d="M10.5 11.5v5.5M13.5 11.5v5.5" />
      </svg>
    </button>
  );
}