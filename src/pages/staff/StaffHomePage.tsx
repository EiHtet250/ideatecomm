import { PagePlaceholder } from '../../components';
import { StaffFeedbackSummary } from '../../components/staff/StaffFeedbackSummary';
import { StaffRequestSummary } from '../../components/staff/StaffRequestSummary';
import { getStaffStrings } from '../../components/staff/staffStrings';

export function StaffHomePage() {
  const strings = getStaffStrings();
  const t = strings.home;

  return (
    <PagePlaceholder title={t.title} description={t.description}>
      <div className="grid-2">
        <section className="home-card">
          <h2>{t.requestsHeading}</h2>
          <StaffRequestSummary strings={strings} />
        </section>
        <section className="home-card">
          <h2>{strings.feedback.heading}</h2>
          <StaffFeedbackSummary strings={strings} />
        </section>
      </div>
    </PagePlaceholder>
  );
}
