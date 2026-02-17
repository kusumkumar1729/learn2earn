import type { Metadata } from 'next';
import AdminDashboardInteractive from './components/AdminDashboardInteractive';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Learn2Earn',
  description: 'Comprehensive administrative control panel for managing users, monitoring platform performance, analyzing learning metrics, and overseeing token distribution across the Learn2Earn educational platform.',
};

export default function AdminDashboardPage() {
  return <AdminDashboardInteractive />;
}