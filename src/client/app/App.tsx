import type { AppOutletContext } from '../shared/lib/router/app-outlet-context';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '@client/widgets/app-header';
import { useCallback, useEffect, useState } from 'react';

export const App = () => {
  const location = useLocation();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const isNewsPage =
    matchPath(
      {
        path: '/',
        end: true,
      },
      location.pathname,
    ) !== null;

  const openFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(true);
  }, []);

  const closeFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false);
  }, []);

  /*
   * Prevent the filter drawer from remaining open after navigating
   * to another route.
   */
  useEffect(() => {
    closeFilterDrawer();
  }, [location.pathname, closeFilterDrawer]);

  const outletContext: AppOutletContext = {
    isFilterDrawerOpen,
    openFilterDrawer,
    closeFilterDrawer,
  };

  return (
    <>
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>
      <AppHeader
        showFilterButton={isNewsPage}
        filtersOpen={isFilterDrawerOpen}
        onOpenFilters={openFilterDrawer}
      />
      <Outlet context={outletContext} />
    </>
  );
};
