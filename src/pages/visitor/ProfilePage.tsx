import { PagePlaceholder, PlaceholderBox } from '../../components';

export function ProfilePage() {
  return (
    <PagePlaceholder
      title="Profile"
      description="The visitor's own details and progress."
      planned={['Profile picture and name', 'Email address', 'Discovery Trail progress and stamps earned', 'Log out']}
    >
      <div className="profile-summary">
        <span className="profile-summary__avatar" aria-hidden="true">
          V
        </span>
        <div>
          <strong>Visitor Name</strong>
          <p className="muted">visitor@example.com</p>
        </div>
      </div>
      <PlaceholderBox label="Trail progress & stamps" size="sm" />
    </PagePlaceholder>
  );
}
