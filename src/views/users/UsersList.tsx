import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useUsersStore } from '@/stores/users';

export function UsersListPage() {
  const users = useUsersStore((state) => state.items);
  const fetchUsers = useUsersStore((state) => state.fetchUsers);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Users</h1>
      <div className="theme-card">
        <Link className="theme-button" to="/en/users/create">
          Create user
        </Link>
      </div>
      {users.map((user) => (
        <div key={user.id} className="theme-card row">
          <span>{user.email}</span>
          <Link className="theme-button" to={`/en/users/${user.id}`}>
            View
          </Link>
          <Link className="theme-button" to={`/en/users/${user.id}/edit`}>
            Edit
          </Link>
        </div>
      ))}
    </LayoutDefault>
  );
}
