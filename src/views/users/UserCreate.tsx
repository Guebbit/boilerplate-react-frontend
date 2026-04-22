import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useUsersStore } from '@/stores/users';

export function UserCreatePage() {
  const [email, setEmail] = useState('new-admin@example.com');
  const [admin, setAdmin] = useState(false);
  const createUser = useUsersStore((state) => state.createUser);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = await createUser(email, admin);
    navigate(`/en/users/${user.id}`);
  };

  return (
    <LayoutDefault centered>
      <form className="theme-card" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="theme-page-title">Create user</h1>
        <label>Email</label>
        <input className="theme-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="row">
          <input type="checkbox" checked={admin} onChange={(event) => setAdmin(event.target.checked)} />
          Admin
        </label>
        <button className="theme-button" type="submit">Save</button>
      </form>
    </LayoutDefault>
  );
}
