import { useState } from 'react';
import { floorName, searchPlaces } from '../../services/mapRouting';
import type { MapPlace } from '../../types/map';

interface PlaceSearchProps {
  id: string;
  label: string;
  placeholder: string;
  value?: MapPlace;
  /** Short note shown beside the chosen place, e.g. "Last scanned location". */
  valueNote?: string;
  onChange: (place: MapPlace | undefined) => void;
}

/** Search box for picking a place by name or floor. Shows the chosen place as a chip. */
export function PlaceSearch({ id, label, placeholder, value, valueNote, onChange }: PlaceSearchProps) {
  const [query, setQuery] = useState('');
  const results = searchPlaces(query);

  return (
    <div className="place-search">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>

      {value ? (
        <div className="place-search__chosen">
          <div className="place-search__chosen-text">
            <strong>{value.name}</strong>
            <span>
              {floorName(value.floorId)}
              {valueNote && ` · ${valueNote}`}
            </span>
          </div>
          <button type="button" id={id} className="place-search__change" onClick={() => onChange(undefined)}>
            Change
          </button>
        </div>
      ) : (
        <>
          <input
            id={id}
            className="form-field__input"
            type="search"
            autoComplete="off"
            placeholder={placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query.trim() && (
            <ul className="place-search__results" aria-label={`${label} results`}>
              {results.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      onChange(place);
                    }}
                  >
                    <strong>{place.name}</strong>
                    <span>{floorName(place.floorId)}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="place-search__none">No place matches “{query.trim()}”.</li>}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
