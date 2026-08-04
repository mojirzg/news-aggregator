import { createBrowserRouter } from 'react-router-dom';
import { ForYouPage } from '@client/pages/for-you';
import { NewsPage } from '@client/pages/news';
import { NotFoundPage } from '@client/pages/not-found';
import { PreferencesPage } from '@client/pages/preferences';
import { App } from './App';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <NewsPage /> },
      { path: 'for-you', element: <ForYouPage /> },
      { path: 'preferences', element: <PreferencesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
