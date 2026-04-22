import { useMemo } from 'react';

import { useProfileStore } from '@/stores/useProfileStore';

export const ProfilePage = () => {
    const profile = useProfileStore((state) => state.profile);

    const roles = useMemo(() => profile?.roles.join(', ') || 'No roles', [profile?.roles]);

    if (!profile)
        return (
            <section>
                <h1>Profile</h1>
                <p>Please login first.</p>
            </section>
        );

    return (
        <section>
            <h1>Profile</h1>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Roles: {roles}</p>
        </section>
    );
};
