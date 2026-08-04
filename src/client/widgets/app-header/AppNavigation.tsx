import { NavLink } from 'react-router-dom';
import { routes } from '@client/shared/config/routes';
import styles from './AppHeader.module.css';

const navItems = [
  { to: routes.news, label: 'News', end: true },
  { to: routes.forYou, label: 'For You' },
  { to: routes.preferences, label: 'Preferences' },
];

export const AppNavigation = () => (
  <nav className={styles.nav} aria-label="Primary navigation">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);
