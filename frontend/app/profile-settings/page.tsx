import type { Metadata } from 'next';
import ProfileSettingsInteractive from './components/ProfileSettingsInteractive';

export const metadata: Metadata = {
  title: 'Profile Settings - Learn2Earn',
  description: 'Manage your account preferences, security settings, notification preferences, and theme customization options on the Learn2Earn platform.',
};

export default function ProfileSettingsPage() {
  return <ProfileSettingsInteractive />;
}