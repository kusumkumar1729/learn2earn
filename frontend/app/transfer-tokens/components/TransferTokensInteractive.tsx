'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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

const initialMockTokens: Token[] = [
  {
    id: '1',
    name: 'EDU Token',
    symbol: 'EDU',
    balance: 1250.50, // Static mock balance
    usdValue: 2501.00,
    change24h: 5.23,
    icon: "https://images.unsplash.com/photo-1643616997533-b2765f43011d",
    alt: 'Golden cryptocurrency coin with circuit board pattern on dark background'
  },
  {
    id: '2',
    name: 'Native EDU',
    symbol: 'ETH',
    balance: 0.45, // Static mock balance
    usdValue: 900.00,
    change24h: -2.15,
    icon: "https://img.rocket.new/generatedImages/rocket_gen_img_117ea879d-1767158662331.png",
    alt: 'Silver Ethereum cryptocurrency coin with diamond logo on blue background'
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
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: 50.0,
    token: 'EDU',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    timestamp: '01/12/2026 14:30',
    status: 'completed',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
    note: 'Payment for course materials'
  }
];

const TransferTokensInteractive = () => {
  const [tokens, setTokens] = useState<Token[]>(initialMockTokens);
  const [isHydrated, setIsHydrated] = useState(false);
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
    setSelectedToken(tokens[0]);
  }, []);

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

  const handleConfirmTransfer = async () => {
    if (!pendingTransfer || !selectedToken) return;

    setShowConfirmModal(false);
    setIsProcessing(true);

    // Simulate delay
    setTimeout(() => {
      setLastTransaction({
        txHash: '0xMockTransactionHash' + Math.random().toString(16).slice(2),
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
        {/* Wallet Connection Removed - Always showing Interface */}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <TokenPortfolio
              tokens={tokens}
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