import { Outlet } from 'react-router-dom';
import { AppHeader } from '@client/widgets/app-header';

export const App = () => (
  <>
    <a className="skipLink" href="#main-content">
      Skip to content
    </a>
    <AppHeader />
    <Outlet />
  </>
);
