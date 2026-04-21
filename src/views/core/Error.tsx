import { useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';

export function ErrorPage() {
  const { status = '500', message = 'unexpected-error' } = useParams();

  return (
    <LayoutDefault centered>
      <div className="theme-card">
        <h1 className="theme-page-title">Error {status}</h1>
        <p>{message}</p>
      </div>
    </LayoutDefault>
  );
}
