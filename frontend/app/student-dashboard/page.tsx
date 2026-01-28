import type { Metadata } from 'next';
import StudentDashboardInteractive from './components/StudentDashboardInteractive';

export const metadata: Metadata = {
  title: 'Student Dashboard - Learn2Earn',
  description: 'Track your learning progress, access courses, manage earned tokens, and view achievements in your personalized student dashboard.',
};

export default function StudentDashboardPage() {
  return <StudentDashboardInteractive />;
}