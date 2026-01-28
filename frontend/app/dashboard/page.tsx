import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
    title: 'Dashboard - Learn2Earn',
    description: 'Your personal Learn2Earn dashboard. View your progress, manage tokens, and access courses.',
};

export default function DashboardPage() {
    return (
        <>
            <Header userRole="student" isAuthenticated={true} />
            <main>
                <DashboardInteractive />
            </main>
        </>
    );
}
