import { Link } from 'react-router-dom';
import { PagePlaceholder, PlaceholderBox } from '../../components';
import { useSettings } from '../../components/settings/SettingsProvider';
import { translateVisitorText } from '../../components/settings/visitorStrings';
import { paths } from '../../routes/paths';

export function VisitorHomePage() {
  const { currentLanguage } = useSettings();
  const t = (text: string) => translateVisitorText(text, currentLanguage);
  return (
    <PagePlaceholder
      title={t("Visitor Home")}
      description={t("Choose the map, explore the Discovery Trail, or play a toy game.")}
    >
      <div className="home-sections">
        <section className="home-card">
          <h2>{t("Museum Map")}</h2>
          <p>{t("Browse exhibits freely, and optionally get directions after scanning a QR code.")}</p>
          <PlaceholderBox label={t("Map preview")} size="sm" />
          <Link to={paths.museumMap} className="home-card__link">
            {t("Open Museum Map →")}
          </Link>
        </section>

        <section className="home-card">
          <h2>{t("Discovery Trail")}</h2>
          <p>{t("A guided trail around the museum is coming soon.")}</p>
          <PlaceholderBox label={t("Discovery Trail preview")} size="sm" />
          <Link to={paths.discoveryTrail} className="home-card__link">
            {t("Open Discovery Trail →")}
          </Link>
        </section>

        <section className="home-card home-card--game">
          <h2>{t("Toy Game")}</h2>
          <p>{t("Play the Toy Time Machine challenge, collect three stamps, and earn 20 points.")}</p>
          <PlaceholderBox label={t("🎮 Game preview")} size="sm" />
          <Link to={paths.toyGame} className="home-card__link">
            {t("Open Toy Game →")}
          </Link>
        </section>
      </div>
    </PagePlaceholder>
  );
}
