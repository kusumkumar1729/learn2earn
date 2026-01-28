'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import WalletConnectionCard from './WalletConnectionCard';
import TokenPortfolio from './TokenPortfolio';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';

// Lazy load modals - only loaded when needed
const TransferConfirmationModal = dynamic(() => import('./TransferConfirmationModal'), { ssr: false });
const TransferSuccessModal = dynamic(() => import('./TransferSuccessModal'), { ssr: false });

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
  alt: string;
}

interface Contact {
  id: string;
  name: string;
  address: string;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  token: string;
  address: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  note?: string;
}

const mockTokens: Token[] = [
  {
    id: '1',
    name: 'Learn2Earn Token',
    symbol: 'L2E',
    balance: 1250.456789,
    usdValue: 2500.91,
    change24h: 5.23,
    icon: "https://images.unsplash.com/photo-1643616997533-b2765f43011d",
    alt: 'Golden cryptocurrency coin with circuit board pattern on dark background'
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 2.345678,
    usdValue: 4691.36,
    change24h: -2.15,
    icon: "https://img.rocket.new/generatedImages/rocket_gen_img_117ea879d-1767158662331.png",
    alt: 'Silver Ethereum cryptocurrency coin with diamond logo on blue background'
  },
  {
    id: '3',
    name: 'USD Coin',
    symbol: 'USDC',
    balance: 500.0,
    usdValue: 500.0,
    change24h: 0.01,
    icon: "https://img.rocket.new/generatedImages/rocket_gen_img_1a4ba10e7-1766487325071.png",
    alt: 'Blue and white USDC stablecoin with circular design on gradient background'
  }
];

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
  },
  {
    id: '2',
    name: 'Bob Smith',
    address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
  },
  {
    id: '3',
    name: 'Carol Williams',
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: 50.0,
    token: 'L2E',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '01/12/2026 14:30',
    status: 'completed',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
    note: 'Payment for course materials'
  },
  {
    id: '2',
    type: 'received',
    amount: 100.0,
    token: 'L2E',
    address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    timestamp: '01/11/2026 09:15',
    status: 'completed',
    txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a'
  },
  {
    id: '3',
    type: 'sent',
    amount: 25.5,
    token: 'ETH',
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    timestamp: '01/10/2026 16:45',
    status: 'completed',
    txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b'
  },
  {
    id: '4',
    type: 'received',
    amount: 75.0,
    token: 'L2E',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '01/09/2026 11:20',
    status: 'completed',
    txHash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c',
    note: 'Reward for completing advanced course'
  },
  {
    id: '5',
    type: 'sent',
    amount: 150.0,
    token: 'USDC',
    address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    timestamp: '01/08/2026 13:00',
    status: 'pending',
    txHash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d'
  }
];

const TransferTokensInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<{
    recipientAddress: string;
    amount: number;
    note: string;
  } | null>(null);
  const [lastTransaction, setLastTransaction] = useState<{
    txHash: string;
    amount: number;
    token: string;
    recipientAddress: string;
  } | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    setSelectedToken(mockTokens[0]);
  }, []);

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setWalletAddress('0x1234567890abcdef1234567890abcdef12345678');
  };

  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
  };

  const handleTransferSubmit = (data: {
    recipientAddress: string;
    amount: number;
    note: string;
  }) => {
    setPendingTransfer(data);
    setShowConfirmModal(true);
  };

  const handleConfirmTransfer = () => {
    if (!pendingTransfer || !selectedToken) return;

    setShowConfirmModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;

      setLastTransaction({
        txHash,
        amount: pendingTransfer.amount,
        token: selectedToken.symbol,
        recipientAddress: pendingTransfer.recipientAddress
      });

      setIsProcessing(false);
      setShowSuccessModal(true);
      setPendingTransfer(null);
    }, 2000);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setLastTransaction(null);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
          <div className="mb-8 h-8 w-64 animate-pulse rounded bg-card" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 h-32 w-full animate-pulse rounded-xl bg-card" />
              <div className="h-96 w-full animate-pulse rounded-xl bg-card" />
            </div>
            <div className="h-96 w-full animate-pulse rounded-xl bg-card" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <WalletConnectionCard
          isConnected={isWalletConnected}
          walletAddress={walletAddress}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
        />

        {isWalletConnected ? (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <TokenPortfolio
                  tokens={mockTokens}
                  onSelectToken={handleSelectToken}
                  selectedTokenId={selectedToken?.id || ''}
                />

                {selectedToken && (
                  <TransferForm
                    selectedToken={selectedToken}
                    contacts={mockContacts}
                    onSubmit={handleTransferSubmit}
                    isProcessing={isProcessing}
                  />
                )}
              </div>

              <div>
                <TransactionHistory transactions={mockTransactions} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-card p-12 shadow-glow-md">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-muted-foreground"
                  >
                    <path
                      d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                Connect Your Wallet
              </h3>
              <p className="font-caption text-sm text-muted-foreground">
                Please connect your wallet to start transferring tokens
              </p>
            </div>
          </div>
        )}
      </div>

      {pendingTransfer && selectedToken && (
        <TransferConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          transferData={{
            recipientAddress: pendingTransfer.recipientAddress,
            amount: pendingTransfer.amount,
            token: selectedToken.symbol,
            networkFee: 0.0015,
            note: pendingTransfer.note
          }}
          onConfirm={handleConfirmTransfer}
        />
      )}

      {lastTransaction && (
        <TransferSuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          transactionData={lastTransaction}
        />
      )}
    </>
  );
};

export default TransferTokensInteractive;