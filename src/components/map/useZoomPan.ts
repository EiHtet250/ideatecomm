import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { MapPoint } from '../../types/map';

interface View {
  /** Screen pixels per map unit. */
  k: number;
  x: number;
  y: number;
}

const DRAG_THRESHOLD_PX = 5;
const MAX_ZOOM_FACTOR = 6;
/** The home view zooms in to at least this many pixels per map unit when there is room, so labels stay readable. */
const READABLE_SCALE = 1.25;
const BUTTON_ZOOM_STEP = 1.5;
/** Space kept around the focus points in the home view. */
const FOCUS_PADDING_PX = 36;

/**
 * Zoom and pan for an SVG whose content is `mapWidth` x `mapHeight` map units.
 * Supports drag, pinch, mouse wheel and buttons. Attach `svgRef` and `handlers` to the <svg>
 * and put `transform` on the <g> that holds the map.
 * `focus` lists map points the home view must show, e.g. a route (default: centred on the map).
 */
export function useZoomPan(mapWidth: number, mapHeight: number, focus?: readonly MapPoint[]) {
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ k: 1, x: 0, y: 0 });
  /** True while the view should glide to its new position (buttons, floor changes), false while dragging. */
  const [gliding, setGliding] = useState(false);

  const limits = useMemo(() => {
    if (!size.w || !size.h) return { min: 1, max: 1, home: 1 };
    const contain = Math.min(size.w / mapWidth, size.h / mapHeight);
    const home = Math.max(contain, Math.min(size.h / mapHeight, READABLE_SCALE));
    return { min: contain, max: home * MAX_ZOOM_FACTOR, home };
  }, [size, mapWidth, mapHeight]);

  /** Keeps the zoom in range and the map inside (or centred in) the viewport. */
  const clamp = useCallback(
    (next: View): View => {
      const k = Math.min(limits.max, Math.max(limits.min, next.k));
      const fit = (offset: number, viewport: number, content: number) =>
        content <= viewport ? (viewport - content) / 2 : Math.min(0, Math.max(viewport - content, offset));
      return { k, x: fit(next.x, size.w, mapWidth * k), y: fit(next.y, size.h, mapHeight * k) };
    },
    [limits, size, mapWidth, mapHeight],
  );

  /** Home view: readable zoom centred on the focus points, zoomed out as far as needed to show them all. */
  const reset = useCallback((glide = true) => {
    setGliding(glide);
    const points = focusRef.current?.length ? focusRef.current : [[mapWidth / 2, mapHeight / 2] as const];
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const [left, right, top, bottom] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const fit = Math.min(
      (size.w - 2 * FOCUS_PADDING_PX) / Math.max(right - left, 1),
      (size.h - 2 * FOCUS_PADDING_PX) / Math.max(bottom - top, 1),
    );
    const k = Math.max(limits.min, Math.min(limits.home, fit));
    setView(clamp({ k, x: size.w / 2 - ((left + right) / 2) * k, y: size.h / 2 - ((top + bottom) / 2) * k }));
  }, [clamp, limits, size, mapWidth, mapHeight]);

  const zoomAt = useCallback(
    (px: number, py: number, factor: number) => {
      setView((current) => {
        const k = Math.min(limits.max, Math.max(limits.min, current.k * factor));
        const ratio = k / current.k;
        return clamp({ k, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio });
      });
    },
    [clamp, limits],
  );

  const zoomByButton = useCallback(
    (factor: number) => {
      setGliding(true);
      zoomAt(size.w / 2, size.h / 2, factor);
    },
    [zoomAt, size],
  );
  const zoomIn = useCallback(() => zoomByButton(BUTTON_ZOOM_STEP), [zoomByButton]);
  const zoomOut = useCallback(() => zoomByButton(1 / BUTTON_ZOOM_STEP), [zoomByButton]);

  // Track the viewport size.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const { width, height } = svg.getBoundingClientRect();
      setSize((current) => (current.w === width && current.h === height ? current : { w: width, h: height }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Start from (and return to) the home view whenever the viewport size changes.
  useEffect(() => {
    if (size.w && size.h) reset(false);
  }, [size, reset]);

  // Wheel zoom. Needs a non-passive listener so the page does not scroll at the same time.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setGliding(false);
      const bounds = svg.getBoundingClientRect();
      zoomAt(event.clientX - bounds.left, event.clientY - bounds.top, Math.exp(-event.deltaY * 0.0015));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  // Drag to pan, two fingers to pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const local = (event: ReactPointerEvent) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const point = local(event);
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 1) {
      dragging.current = false;
      start.current = point;
    }
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const point = local(event);
    setGliding(false);

    if (pointers.current.size === 1) {
      if (!dragging.current) {
        if (Math.hypot(point.x - start.current.x, point.y - start.current.y) < DRAG_THRESHOLD_PX) return;
        // Capturing only once a drag starts keeps plain taps working on the markers.
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      pointers.current.set(event.pointerId, point);
      setView((current) => clamp({ ...current, x: current.x + point.x - previous.x, y: current.y + point.y - previous.y }));
      return;
    }

    const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1];
    pointers.current.set(event.pointerId, point);
    if (!other) return;
    dragging.current = true;
    const before = Math.hypot(previous.x - other.x, previous.y - other.y);
    const after = Math.hypot(point.x - other.x, point.y - other.y);
    if (before > 0 && after > 0) zoomAt((point.x + other.x) / 2, (point.y + other.y) / 2, after / before);
  };

  const onPointerEnd = (event: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    svgRef,
    /** Put on the <g> that holds the map. */
    viewStyle: {
      transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
      transition: gliding ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
    },
    handlers: { onPointerDown, onPointerMove, onPointerUp: onPointerEnd, onPointerCancel: onPointerEnd },
    canZoomIn: view.k < limits.max - 1e-6,
    canZoomOut: view.k > limits.min + 1e-6,
    zoomIn,
    zoomOut,
    reset,
  };
}
