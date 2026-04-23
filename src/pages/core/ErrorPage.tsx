import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const ErrorPage = () => {
    const { code } = useParams();
    const message = useMemo(() => {
        if (code === '404') return 'Page not found';
        if (code === '401') return 'Unauthorized';
        return 'Unexpected application error';
    }, [code]);

    return (
        <section>
            <h1>Error {code ?? '500'}</h1>
            <p>{message}</p>
        </section>
    );
};
