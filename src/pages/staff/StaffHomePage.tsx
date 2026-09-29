import { Link } from 'react-router-dom';
import { PagePlaceholder, PlaceholderBox } from '../../components';
import { paths } from '../../routes/paths';

export function StaffHomePage() {
  return (
    <PagePlaceholder
      title="Staff Home"
      description="Overview for museum staff on duty."
      planned={[
        'Summary of open help requests',
        'Quick link to Help Requests',
        'Space for future staff tools (team to decide)',
      ]}
    >
      <div className="grid-2">
        <section className="home-card">
          <h2>Help requests</h2>
          <PlaceholderBox label="Open requests summary" size="sm" />
          <Link to={paths.helpRequests} className="home-card__link">
            View Help Requests →
          </Link>
        </section>
        <section className="home-card">
          <h2>Future staff feature</h2>
          <PlaceholderBox label="Reserved space" size="sm" />
        </section>
      </div>
    </PagePlaceholder>
  );
}
