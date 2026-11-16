import { useEffect, useState } from "react";
import {
  createDestination,
  deleteDestination,
  fetchDestinations,
  updateDestination
} from "../api.js";

// The list of destinations and everything that changes it, the same code App had in stage 7.
// Layout calls it once and passes the result to every page through <Outlet context>,
// so the list is loaded once and the globe, the list and Get inspired always show the same data.
export default function useDestinations() {
  // The list starts empty, because the data comes from the server
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs once, after the first render
  useEffect(() => {
    let ignore = false; // no state is set if the page closed in the meantime

    // load is declared inside, because the function given to useEffect cannot be async
    async function load() {
      try {
        const data = await fetchDestinations();
        if (!ignore) setDestinations(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Stage 7: server first, then state. Only what was saved reaches the screen,
  // and the id comes from the server, it is not made up here.
  // No try: the error goes back to the form, which shows it next to the fields.
  async function addDestination(details) {
    const created = await createDestination({ visited: false, rating: 0, ...details });
    setDestinations((prev) => [...prev, created]);
    setError(null);
  }

  // "Get inspired" has no form of its own, so a failed save is shown on the page
  async function addSuggestion(details) {
    try {
      await addDestination(details);
    } catch (err) {
      setError(err.message);
    }
  }

  // PATCH sends only what changed; the list then takes the object the server returned
  async function changeDestination(id, changes) {
    try {
      const updated = await updateDestination(id, changes);
      setDestinations((prev) => prev.map((dest) => (dest.id === id ? updated : dest)));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // The current value is read from the list, because PATCH sends only { visited }
  function toggleVisited(id) {
    const dest = destinations.find((d) => d.id === id);
    if (dest) return changeDestination(id, { visited: !dest.visited });
  }

  const rateDestination = (id, rating) => changeDestination(id, { rating });

  async function removeDestination(id) {
    try {
      await deleteDestination(id);
      setDestinations((prev) => prev.filter((dest) => dest.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    destinations,
    loading,
    error,
    addDestination,
    addSuggestion,
    changeDestination,
    toggleVisited,
    rateDestination,
    removeDestination
  };
}
