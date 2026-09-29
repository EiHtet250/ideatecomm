import { Link } from 'react-router-dom';
import { PagePlaceholder, PlaceholderBox } from '../../components';
import { paths } from '../../routes/paths';

export function VisitorHomePage() {
  return (
    <PagePlaceholder
      title="Visitor Home"
      description="Starting point for visitors. Two main sections: Museum Map and Discovery Trail."
    >
      <div className="home-sections">
        <section className="home-card">
          <h2>Museum Map</h2>
          <p>Browse exhibits freely, and optionally get directions after scanning a QR code.</p>
          <PlaceholderBox label="Map preview" size="sm" />
          <Link to={paths.museumMap} className="home-card__link">
            Open Museum Map →
          </Link>
        </section>

        <section className="home-card">
          <h2>Discovery Trail</h2>
          <p>Follow the game map, complete challenges and collect digital stamps.</p>
          <PlaceholderBox label="Trail progress preview" size="sm" />
          <Link to={paths.discoveryTrail} className="home-card__link">
            Open Discovery Trail →
          </Link>
        </section>
      </div>
    </PagePlaceholder>
  );
}
