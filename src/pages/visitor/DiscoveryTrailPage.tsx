import { PagePlaceholder, PlaceholderBox } from '../../components';

/** Uses the same floor/location data as the Museum Map, plus trail stops and stamps. */
export function DiscoveryTrailPage() {
  return (
    <PagePlaceholder
      title="Discovery Trail"
      description="Game view of the museum: follow the stops and collect stamps."
      planned={[
        'Game map showing trail stops (uses src/data/trailStops.ts + shared locations)',
        'Challenge for each stop',
        'Digital stamp collection (uses src/data/stamps.ts)',
        'Progress tracking',
      ]}
    >
      <PlaceholderBox label="Trail game map" note="Not built yet" size="lg" />
      <div className="grid-2">
        <PlaceholderBox label="Current stop & challenge" size="sm" />
        <PlaceholderBox label="Stamp collection" size="sm" />
      </div>
    </PagePlaceholder>
  );
}
