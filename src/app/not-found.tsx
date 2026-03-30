import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <div className="not-found-card">
        <span className="eyebrow">Route not found</span>
        <h1>This page does not exist in the Farmora workspace.</h1>
        <p>The route may be invalid, or the module was not registered in the dashboard section map.</p>
        <Link href="/dashboard/overview" className="primary-button primary-button--link">
          Return to overview
        </Link>
      </div>
    </main>
  );
}
