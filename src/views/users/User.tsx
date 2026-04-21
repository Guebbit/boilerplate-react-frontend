import { Link, useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useUsersStore } from '@/stores/users';

export function UserPage() {
  const { id = '' } = useParams();
  const user = useUsersStore((state) => state.items.find((item) => item.id === id));

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">User</h1>
      <div className="theme-card">
        <p>ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
        <p>Admin: {user?.admin ? 'Yes' : 'No'}</p>
        <Link className="theme-button" to={`/en/users/${id}/edit`}>
          Edit
        </Link>
      </div>
    </LayoutDefault>
  );
}
