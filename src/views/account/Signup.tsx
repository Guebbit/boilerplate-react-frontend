import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useProfileStore } from '@/stores/profile';

export function SignupPage() {
  const [email, setEmail] = useState('new-user@example.com');
  const [password, setPassword] = useState('password');
  const signup = useProfileStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await signup(email, password);
    navigate('/en/account/profile');
  };

  return (
    <LayoutDefault centered>
      <form className="theme-card" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="theme-page-title">Signup</h1>
        <label>Email</label>
        <input className="theme-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label>Password</label>
        <input className="theme-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <div className="row">
          <button className="theme-button" type="submit">Create account</button>
        </div>
      </form>
    </LayoutDefault>
  );
}
