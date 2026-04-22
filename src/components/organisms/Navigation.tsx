import { NavLink } from 'react-router-dom';

const links = [
  { to: '/en', label: 'Home' },
  { to: '/en/account/profile', label: 'Profile' },
  { to: '/en/products', label: 'Products' },
  { to: '/en/users', label: 'Users' },
  { to: '/en/cart', label: 'Cart' },
  { to: '/en/orders', label: 'Orders' },
  { to: '/en/redux-example', label: 'Redux example' }
];

export function Navigation({
  profileLabel,
  children
}: {
  profileLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="navigation">
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="row">
        {children}
        {profileLabel ? <strong>Hello {profileLabel}</strong> : null}
      </div>
    </header>
  );
}
