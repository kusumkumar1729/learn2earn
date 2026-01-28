import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import NavigationBreadcrumb from '@/components/common/NavigationBreadcrumb';
import TransferTokensInteractive from './components/TransferTokensInteractive';

export const metadata: Metadata = {
  title: 'Transfer Tokens - Learn2Earn',
  description: 'Securely transfer cryptocurrency tokens to other users through our intuitive wallet interface with real-time transaction tracking and blockchain integration.',
};

export default function TransferTokensPage() {
  return (
    <>
      <Header userRole="student" isAuthenticated={true} />
      
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
          <NavigationBreadcrumb />
          
          <div className="mb-8">
            <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
              Transfer Tokens
            </h1>
            <p className="font-caption text-base text-muted-foreground">
              Send cryptocurrency tokens securely to other wallet addresses
            </p>
          </div>

          <TransferTokensInteractive />
        </div>
      </main>
    </>
  );
}