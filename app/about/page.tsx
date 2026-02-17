import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import AboutInteractive from './components/AboutInteractive';

export const metadata: Metadata = {
    title: 'About Learn2Earn - Blockchain-Powered Education Platform',
    description: 'Learn about Learn2Earn, a revolutionary platform that transforms education into cryptocurrency rewards through blockchain technology.',
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main>
                <AboutInteractive />
            </main>
        </>
    );
}
