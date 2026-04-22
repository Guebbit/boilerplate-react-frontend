import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useProfileStore } from '@/stores/profile';

export function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  const logout = useProfileStore((state) => state.logout);

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Profile</h1>
      <div className="theme-card">
        <p>Email: {profile?.email ?? '-'}</p>
        <p>Username: {profile?.username ?? '-'}</p>
        <p>Admin: {profile?.admin ? 'Yes' : 'No'}</p>
        <button className="theme-button" type="button" onClick={() => void logout()}>
          Logout
        </button>
      </div>
    </LayoutDefault>
  );
}
