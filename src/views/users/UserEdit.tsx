import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useUsersStore } from '@/stores/users';

export function UserEditPage() {
  const { id = '' } = useParams();
  const user = useUsersStore((state) => state.items.find((item) => item.id === id));
  const updateUser = useUsersStore((state) => state.updateUser);
  const [email, setEmail] = useState(user?.email ?? '');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateUser(id, { email });
    navigate(`/en/users/${id}`);
  };

  return (
    <LayoutDefault centered>
      <form className="theme-card" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="theme-page-title">Edit user</h1>
        <label>Email</label>
        <input className="theme-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="theme-button" type="submit">Update</button>
      </form>
    </LayoutDefault>
  );
}
