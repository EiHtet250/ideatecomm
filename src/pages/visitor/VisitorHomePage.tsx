import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PagePlaceholder } from '../../components';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';
import { paths } from '../../routes/paths';
import './visitorHome.css';

/** Small floor plan with a route and a destination pin. */
function MapArt() {
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <rect className="vh-art__paper" x="22" y="18" width="196" height="84" rx="10" />
      <path className="vh-art__wall" d="M22 58 H96 V18 M150 18 V58 H218 M96 102 V84" />
      <rect className="vh-art__room" x="158" y="26" width="52" height="24" rx="4" />
      <path className="vh-art__route" d="M52 84 H124 V40 H170" />
      <circle className="vh-art__start" cx="52" cy="84" r="7" />
      <path className="vh-art__pin" d="M170 42 C163 33 162 30 162 26 A8 8 0 1 1 178 26 C178 30 177 33 170 42 Z" />
      <circle className="vh-art__dot" cx="170" cy="26" r="3" />
    </svg>
  );
}

/** Winding trail with checkpoints and a stamp at the end. */
function TrailArt() {
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <path className="vh-art__trail" d="M26 92 C60 92 54 40 96 40 S128 88 162 82 S196 44 214 36" />
      <circle className="vh-art__check vh-art__check--done" cx="26" cy="92" r="11" />
      <path className="vh-art__tick" d="M21 92 L25 96 L32 88" />
      <circle className="vh-art__check vh-art__check--done" cx="96" cy="40" r="11" />
      <path className="vh-art__tick" d="M91 40 L95 44 L102 36" />
      <circle className="vh-art__check" cx="162" cy="82" r="11" />
      <text className="vh-art__number" x="162" y="86.5" textAnchor="middle" fontSize="13">
        3
      </text>
      <g className="vh-art__stamp">
        <circle className="vh-art__stamp-edge" cx="206" cy="38" r="20" />
        <path className="vh-art__star" d="M206 25 L209.8 33.6 L219 34.5 L212 40.6 L214.1 49.7 L206 44.9 L197.9 49.7 L200 40.6 L193 34.5 L202.2 33.6 Z" />
      </g>
    </svg>
  );
}

/** Toy rocket with stars, for the toy game. */
function GameArt() {
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      <path className="vh-art__sparkle" d="M48 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z M190 70 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z M72 88 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" />
      <g className="vh-art__rocket">
        <path className="vh-art__rocket-body" d="M120 14 C136 30 141 52 138 76 H102 C99 52 104 30 120 14 Z" />
        <path className="vh-art__rocket-fin" d="M102 62 L86 84 L102 80 Z M138 62 L154 84 L138 80 Z" />
        <circle className="vh-art__rocket-window" cx="120" cy="46" r="9" />
        <path className="vh-art__rocket-flame" d="M109 76 H131 L126 100 L120 88 L114 100 Z" />
      </g>
    </svg>
  );
}

interface HomeCardProps {
  to: string;
  title: string;
  text: string;
  linkLabel: string;
  tone: 'map' | 'trail' | 'game';
  art: ReactNode;
  className?: string;
}

/** The whole card is clickable (the link stretches over it) and lifts on hover or focus. */
function HomeCard({ to, title, text, linkLabel, tone, art, className = '' }: HomeCardProps) {
  return (
    <section className={`home-card vh-card vh-card--${tone} ${className}`}>
      <div className="vh-card__art">{art}</div>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to={to} className="home-card__link vh-card__link">
        {linkLabel}
      </Link>
    </section>
  );
}

export function VisitorHomePage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <PagePlaceholder
      title={t("Visitor Home")}
      description={t("Choose the map, explore the Discovery Trail, or play a toy game.")}
    >
      <div className="home-sections vh-cards">
        <HomeCard
          to={paths.museumMap}
          tone="map"
          art={<MapArt />}
          title={t("Museum Map")}
          text={t("Browse exhibits freely, and optionally get directions after scanning a QR code.")}
          linkLabel={t("Open Museum Map →")}
        />
        <HomeCard
          to={paths.discoveryTrail}
          tone="trail"
          art={<TrailArt />}
          title={t("Discovery Trail")}
          text={t("Follow the clues, scan QR codes around the museum and collect toy stamps.")}
          linkLabel={t("Open Discovery Trail →")}
        />
        <HomeCard
          to={paths.toyGame}
          tone="game"
          art={<GameArt />}
          className="home-card--game"
          title={t("Toy Game")}
          text={t("Play the Toy Time Machine challenge, collect three stamps, and earn 20 points.")}
          linkLabel={t("Open Toy Game →")}
        />
      </div>
    </PagePlaceholder>
  );
}
