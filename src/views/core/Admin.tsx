import { LayoutDefault } from '@/layouts/LayoutDefault';

export function AdminPage() {
  return (
    <LayoutDefault centered>
      <div className="theme-card">
        <h1 className="theme-page-title">Admin area</h1>
        <p>This route is protected by RequireAdmin middleware.</p>
      </div>
    </LayoutDefault>
  );
}
