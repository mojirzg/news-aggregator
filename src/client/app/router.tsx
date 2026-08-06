import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';

const NewsPage = lazy(() =>
  import('@client/pages/news').then((module) => ({
    default: module.NewsPage,
  })),
);

const ForYouPage = lazy(() =>
  import('@client/pages/for-you').then((module) => ({
    default: module.ForYouPage,
  })),
);

const PreferencesPage = lazy(() =>
  import('@client/pages/preferences').then((module) => ({
    default: module.PreferencesPage,
  })),
);

const NotFoundPage = lazy(() =>
  import('@client/pages/not-found').then((module) => ({
    default: module.NotFoundPage,
  })),
);

const page = (element: React.ReactNode) => (
  <Suspense fallback={<div>Loading page…</div>}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: page(<NewsPage />),
      },
      {
        path: '/for-you',
        element: page(<ForYouPage />),
      },
      {
        path: '/preferences',
        element: page(<PreferencesPage />),
      },
      {
        path: '*',
        element: page(<NotFoundPage />),
      },
    ],
  },
]);
