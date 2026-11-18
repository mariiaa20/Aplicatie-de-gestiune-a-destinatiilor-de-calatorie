import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PageErrorBoundary from "./components/PageErrorBoundary.jsx";
import DestinationsPage from "./pages/DestinationsPage.jsx";
import DestinationDetailPage from "./pages/DestinationDetailPage.jsx";
import InspirationPage from "./pages/InspirationPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { useLanguage } from "./i18n/LanguageContext.js";

// The heavy pages are loaded only when they are opened: the globe brings the world map
// and d3-geo, so the first page of the app opens much faster without them.
const GlobePage = lazy(() => import("./pages/GlobePage.jsx"));
const WhereNextPage = lazy(() => import("./pages/WhereNextPage.jsx"));
const StatsPage = lazy(() => import("./pages/StatsPage.jsx"));

// shown for a moment while a lazy page arrives
function PageLoading() {
  const { t } = useLanguage();
  return <p className="info page-status">{t.common.openingPage}</p>;
}

// wraps a lazy page, so React knows what to show while it loads
const later = (page) => (
  // dacă pagina nu se poate încărca sau se strică, apare un mesaj, nu un ecran alb
  <PageErrorBoundary>
    <Suspense fallback={<PageLoading />}>{page}</Suspense>
  </PageErrorBoundary>
);

// The map of the app: which page is drawn for which address.
// Layout has no path, so every page is drawn inside it, in the place of <Outlet />.
// The detail route uses the resource from tw.json: /destinations/:id
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailPage />} />
        <Route path="/globe" element={later(<GlobePage />)} />
        {/* the old address of Visited Places still works */}
        <Route path="/visited" element={<Navigate to="/globe" replace />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/where-next" element={later(<WhereNextPage />)} />
        <Route path="/stats" element={later(<StatsPage />)} />
        <Route path="/about" element={<AboutPage />} />
        {/* any address that did not match one of the routes above */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
