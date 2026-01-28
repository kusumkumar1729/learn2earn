import type { Metadata } from 'next';
import RedeemTokensInteractive from './components/RedeemTokensInteractive';

export const metadata: Metadata = {
  title: 'Redeem Tokens - Learn2Earn',
  description: 'Exchange your earned cryptocurrency tokens for valuable rewards including course upgrades, certificates, merchandise, and platform credits.',
};

export default function RedeemTokensPage() {
  return <RedeemTokensInteractive />;
}