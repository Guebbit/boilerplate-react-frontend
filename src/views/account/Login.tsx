import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useProfileStore } from '@/stores/profile';

export function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const login = useProfileStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(email, password);
    navigate(searchParams.get('continue') ?? '/en');
  };

  return (
    <LayoutDefault centered>
      <form className="theme-card" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="theme-page-title">Login</h1>
        <label>Email</label>
        <input className="theme-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label>Password</label>
        <input className="theme-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <div className="row">
          <button className="theme-button" type="submit">Login</button>
        </div>
      </form>
    </LayoutDefault>
  );
}
