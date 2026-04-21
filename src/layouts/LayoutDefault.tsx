import { useEffect } from 'react';

import { LoadingCore } from '@/components/atoms/LoadingCore';
import { LoadingSide } from '@/components/atoms/LoadingSide';
import { Navigation } from '@/components/organisms/Navigation';
import { useProfileStore } from '@/stores/profile';
import { isCoreLoading, useCoreStore, useNotificationsStore } from '@/toolkit/react-toolkit';

interface LayoutDefaultProps {
  centered?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function LayoutDefault({ centered = false, header, children }: LayoutDefaultProps) {
  const profile = useProfileStore((state) => state.profile);
  const refreshToken = useProfileStore((state) => state.refreshToken);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const loadings = useCoreStore((state) => state.loadings);
  const messages = useNotificationsStore((state) => state.messages());
  const hideMessage = useNotificationsStore((state) => state.hideMessage);

  useEffect(() => {
    if (!profile) {
      refreshToken().then(() => fetchProfile());
    }
  }, [profile, refreshToken, fetchProfile]);

  return (
    <>
      <Navigation profileLabel={profile?.email} />

      {messages.length > 0 ? (
        <div className="toast-container">
          {messages.map((alert) => (
            <div key={alert.id} className="theme-card toast-card">
              <span>{alert.message}</span>
              <button className="theme-button" type="button" onClick={() => hideMessage(alert.id)}>
                X
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <main className={`page-content${centered ? ' full-page centered' : ''}`}>
        {header ? <div>{header}</div> : null}
        <div className="page-container">{children}</div>
      </main>

      {loadings.core ? <LoadingCore /> : null}
      {isCoreLoading() && !loadings.core ? <LoadingSide /> : null}
    </>
  );
}
