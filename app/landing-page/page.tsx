import type { Metadata } from 'next';
import LandingPageInteractive from './components/LandingPageInteractive';

export const metadata: Metadata = {
  title: 'Learn2Earn - Blockchain-Powered Education Platform',
  description: 'Transform your education into cryptocurrency rewards with blockchain-powered learning. Complete courses, earn tokens, and unlock your potential with Learn2Earn.',
};

export default function LandingPage() {
  return <LandingPageInteractive />;
}