import { PagePlaceholder, PlaceholderBox } from '../../components';

/** Uses the shared floor/location/exhibit data in src/data (same as the Discovery Trail). */
export function MuseumMapPage() {
  return (
    <PagePlaceholder
      title="Museum Map"
      description="Free browsing of the museum's floors and exhibits."
      planned={[
        'Floor selector (uses src/data/floors.ts)',
        'Floor map with locations and exhibits (uses src/data/locations.ts and exhibits.ts)',
        'Exhibit details when a location is selected',
        'Optional directions after scanning a location QR code',
      ]}
    >
      <PlaceholderBox label="Floor selector" size="sm" />
      <PlaceholderBox label="Museum floor map" note="Not built yet" size="lg" />
      <PlaceholderBox label="Directions (after QR scan)" size="sm" />
    </PagePlaceholder>
  );
}
