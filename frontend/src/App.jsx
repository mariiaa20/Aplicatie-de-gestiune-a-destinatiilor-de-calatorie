import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import DestinationsPage from "./pages/DestinationsPage.jsx";
import DestinationDetailPage from "./pages/DestinationDetailPage.jsx";
import GlobePage from "./pages/GlobePage.jsx";
import InspirationPage from "./pages/InspirationPage.jsx";
import WhereNextPage from "./pages/WhereNextPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// The map of the app: which page is drawn for which address.
// Layout has no path, so every page is drawn inside it, in the place of <Outlet />.
// The detail route uses the resource from tw.json: /destinations/:id
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailPage />} />
        <Route path="/globe" element={<GlobePage />} />
        {/* the old address of Visited Places still works */}
        <Route path="/visited" element={<Navigate to="/globe" replace />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/where-next" element={<WhereNextPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* any address that did not match one of the routes above */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
