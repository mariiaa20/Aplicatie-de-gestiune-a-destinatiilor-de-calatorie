import { useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";

// How long one page takes to turn, in milliseconds
const TURN_MS = 900;

// One page of the open passport. The book shows two of them side by side.
export function BookPage({ number, className = "", children }) {
  return (
    <div className={`book-page ${className}`}>
      {children}
      <span className="book-page-number">{number}</span>
    </div>
  );
}

// A copy of a page, only to be looked at while it turns:
// it keeps the ticked boxes and chosen values, it cannot be clicked,
// and the automated checks never count it as a real item
function copyOf(page, side) {
  const copy = page.cloneNode(true);

  const fields = page.querySelectorAll("input, select, textarea");
  const copiedFields = copy.querySelectorAll("input, select, textarea");
  fields.forEach((field, index) => {
    copiedFields[index].checked = field.checked;
    if (field.type !== "file") copiedFields[index].value = field.value;
  });

  copy.querySelectorAll("[data-testid], [data-visa]").forEach((element) => {
    element.removeAttribute("data-testid");
    element.removeAttribute("data-visa");
  });
  copy.setAttribute("inert", "");
  copy.classList.add(side === 0 ? "is-left" : "is-right");
  return copy;
}

function pagesOf(book) {
  return book ? [...book.querySelectorAll(":scope > .book-pages > .book-page")] : [];
}

// where an element is, measured from the top left corner of the book
function placeOf(element, book) {
  const box = element.getBoundingClientRect();
  const origin = book.getBoundingClientRect();
  return { left: box.left - origin.left, top: box.top - origin.top, width: box.width, height: box.height };
}

function putAt(element, place) {
  element.style.left = `${place.left}px`;
  element.style.top = `${place.top}px`;
  element.style.width = `${place.width}px`;
  element.style.height = `${place.height}px`;
}

function addShade(page) {
  const shade = document.createElement("div");
  shade.className = "book-shade";
  page.append(shade);
  return shade;
}

// The open passport: two pages (children), a page turn when the spread changes,
// and the buttons to turn the pages under it.
// Props: spread (which spread is open, from 0), spreadCount, onSpreadChange(index),
// labels (optional, one name per spread, used on the buttons),
// ref (optional): the parent can call ref.current.turnTo(index)
export default function PassportBook({
  spread,
  spreadCount,
  onSpreadChange,
  labels,
  className = "",
  ref,
  children
}) {
  const bookRef = useRef(null);
  const layerRef = useRef(null);
  const pendingRef = useRef(null); // the old pages, copied just before the spread changes
  const turningRef = useRef(null); // the running animations

  function turnTo(index) {
    const target = Math.min(Math.max(index, 0), spreadCount - 1);
    if (target === spread || turningRef.current) return;

    const book = bookRef.current;
    const pages = pagesOf(book);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 860px)").matches;

    // on a phone the pages are one under the other, so they fade in (CSS) instead of turning
    if (book && pages.length === 2 && !reduceMotion && !narrow) {
      pendingRef.current = {
        forward: target > spread,
        oldPages: pages.map((page, side) => copyOf(page, side)),
        places: pages.map((page) => placeOf(page, book)),
        height: book.offsetHeight
      };
    }

    onSpreadChange(target);

    // a long page: bring the top of the passport back into view
    if (book && book.getBoundingClientRect().top < 0) {
      book.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  useImperativeHandle(ref, () => ({ turnTo }));

  // runs after React has drawn the new spread, before the browser shows it
  useLayoutEffect(() => {
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!pending) return;

    const book = bookRef.current;
    const layer = layerRef.current;
    const newPages = pagesOf(book);
    if (!book || !layer || newPages.length !== 2) return;

    const { forward, oldPages, places, height } = pending;

    // Forward: the right page lifts, turns over the spine and lands on the left.
    // Its front is the old right page, its back is the new left page.
    // Until it lands, the old left page stays where it was.
    const still = forward ? oldPages[0] : oldPages[1];
    const front = forward ? oldPages[1] : oldPages[0];
    const back = copyOf(forward ? newPages[0] : newPages[1], forward ? 0 : 1);

    const leaf = document.createElement("div");
    leaf.className = "book-leaf";
    front.classList.add("book-leaf-front");
    back.classList.add("book-leaf-back");
    leaf.append(front, back);

    putAt(still, forward ? places[0] : places[1]);
    putAt(leaf, forward ? places[1] : places[0]);
    leaf.style.transformOrigin = forward ? "left center" : "right center";
    layer.append(still, leaf);

    // keep the book as tall as before while the page turns
    book.style.minHeight = `${height}px`;

    const timing = { duration: TURN_MS, easing: "cubic-bezier(0.645, 0.045, 0.355, 1)" };
    const turn = leaf.animate(
      [{ transform: "rotateY(0deg)" }, { transform: `rotateY(${forward ? -180 : 180}deg)` }],
      timing
    );
    const frontShade = addShade(front).animate([{ opacity: 0 }, { opacity: 1 }], {
      ...timing,
      duration: TURN_MS / 2
    });
    const backShade = addShade(back).animate([{ opacity: 1 }, { opacity: 0 }], {
      ...timing,
      duration: TURN_MS / 2,
      delay: TURN_MS / 2,
      fill: "backwards"
    });

    function finish() {
      layer.replaceChildren();
      book.style.minHeight = "";
      turningRef.current = null;
    }

    turningRef.current = [turn, frontShade, backShade];
    turn.onfinish = finish;
    turn.oncancel = finish;
  }, [spread]);

  // leaving the page in the middle of a turn: stop the animation
  useEffect(() => {
    return () => turningRef.current?.forEach((animation) => animation.cancel());
  }, []);

  const hasPrevious = spread > 0;
  const hasNext = spread < spreadCount - 1;

  return (
    <>
      <div ref={bookRef} className={`passport-book ${className}`}>
        <div className="book-pages">{children}</div>
        {/* filled by the effect above, only while a page turns */}
        <div ref={layerRef} className="book-flip-layer" aria-hidden="true" />
      </div>

      {spreadCount > 1 && (
        <div className="book-pager">
          <button
            type="button"
            className={hasPrevious ? "btn btn-ghost" : "btn btn-ghost is-hidden"}
            disabled={!hasPrevious}
            onClick={() => turnTo(spread - 1)}
          >
            ‹ {labels?.[spread - 1] ?? "Previous pages"}
          </button>
          <span className="book-pager-count">
            {spread + 1} / {spreadCount}
          </span>
          <button
            type="button"
            className={hasNext ? "btn btn-ghost" : "btn btn-ghost is-hidden"}
            disabled={!hasNext}
            onClick={() => turnTo(spread + 1)}
          >
            {labels?.[spread + 1] ?? "Next pages"} ›
          </button>
        </div>
      )}
    </>
  );
}
