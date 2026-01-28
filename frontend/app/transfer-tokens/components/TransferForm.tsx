'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
}

interface Contact {
  id: string;
  name: string;
  address: string;
}

interface TransferFormProps {
  selectedToken: Token;
  contacts: Contact[];
  onSubmit: (data: {
    recipientAddress: string;
    amount: number;
    note: string;
  }) => void;
  isProcessing: boolean;
}

const TransferForm = ({
  selectedToken,
  contacts,
  onSubmit,
  isProcessing,
}: TransferFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [errors, setErrors] = useState<{
    recipientAddress?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-glow-md">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const validateAddress = (address: string) => {
    if (!address) return 'Recipient address is required';
    if (address.length < 42) return 'Invalid wallet address format';
    if (!address.startsWith('0x')) return 'Address must start with 0x';
    return '';
  };

  const validateAmount = (value: string) => {
    if (!value) return 'Amount is required';
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return 'Amount must be greater than 0';
    if (numValue > selectedToken.balance)
      return 'Insufficient balance';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const addressError = validateAddress(recipientAddress);
    const amountError = validateAmount(amount);

    if (addressError || amountError) {
      setErrors({
        recipientAddress: addressError,
        amount: amountError,
      });
      return;
    }

    setErrors({});
    onSubmit({
      recipientAddress,
      amount: parseFloat(amount),
      note,
    });
  };

  const handleSelectContact = (contact: Contact) => {
    setRecipientAddress(contact.address);
    setShowContacts(false);
    setErrors({ ...errors, recipientAddress: '' });
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: '' });
    }
  };

  const handleAddressChange = (value: string) => {
    setRecipientAddress(value);
    if (errors.recipientAddress) {
      setErrors({ ...errors, recipientAddress: '' });
    }
  };

  const setMaxAmount = () => {
    const maxAmount = selectedToken.balance * 0.99;
    setAmount(maxAmount.toFixed(6));
    setErrors({ ...errors, amount: '' });
  };

  const presetAmounts = [10, 50, 100, 500];
  const networkFee = 0.0015;
  const estimatedTotal = parseFloat(amount || '0') + networkFee;

  return (
    <div className="rounded-xl bg-card p-6 shadow-glow-md">
      <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
        Transfer Tokens
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="recipient"
            className="mb-2 block font-caption text-sm font-medium text-foreground"
          >
            Recipient Address
          </label>
          <div className="relative">
            <input
              id="recipient"
              type="text"
              value={recipientAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="0x..."
              className={`w-full rounded-md bg-input px-4 py-3 pr-12 font-mono text-sm text-foreground placeholder-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card ${
                errors.recipientAddress
                  ? 'ring-2 ring-error focus:ring-error' :'focus:ring-primary'
              }`}
              disabled={isProcessing}
            />
            <button
              type="button"
              onClick={() => setShowContacts(!showContacts)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isProcessing}
            >
              <Icon name="UserGroupIcon" size={20} />
            </button>
          </div>
          {errors.recipientAddress && (
            <p className="mt-1 font-caption text-xs text-error">
              {errors.recipientAddress}
            </p>
          )}

          {showContacts && contacts.length > 0 && (
            <div className="mt-2 rounded-md bg-popover shadow-glow-lg">
              <div className="p-2">
                <p className="px-2 py-1 font-caption text-xs text-muted-foreground">
                  Recent Contacts
                </p>
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className="w-full rounded-md px-3 py-2 text-left transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <p className="font-caption text-sm font-medium text-foreground">
                      {contact.name}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {contact.address.slice(0, 10)}...
                      {contact.address.slice(-8)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="amount"
              className="font-caption text-sm font-medium text-foreground"
            >
              Amount
            </label>
            <button
              type="button"
              onClick={setMaxAmount}
              className="font-caption text-xs text-primary transition-smooth hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
              disabled={isProcessing}
            >
              Max: {selectedToken.balance.toFixed(6)} {selectedToken.symbol}
            </button>
          </div>
          <div className="relative">
            <input
              id="amount"
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-md bg-input px-4 py-3 pr-20 font-mono text-sm text-foreground placeholder-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card ${
                errors.amount
                  ? 'ring-2 ring-error focus:ring-error' :'focus:ring-primary'
              }`}
              disabled={isProcessing}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
              {selectedToken.symbol}
            </span>
          </div>
          {errors.amount && (
            <p className="mt-1 font-caption text-xs text-error">
              {errors.amount}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAmountChange(preset.toString())}
                className="rounded-md bg-muted px-4 py-2 font-mono text-xs font-medium text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                disabled={isProcessing}
              >
                {preset} {selectedToken.symbol}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="note"
            className="mb-2 block font-caption text-sm font-medium text-foreground"
          >
            Note (Optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note to this transfer..."
            rows={3}
            className="w-full rounded-md bg-input px-4 py-3 font-caption text-sm text-foreground placeholder-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
            disabled={isProcessing}
          />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm text-muted-foreground">
                Transfer Amount
              </span>
              <span className="font-mono text-sm text-foreground">
                {amount || '0.00'} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm text-muted-foreground">
                Network Fee
              </span>
              <span className="font-mono text-sm text-foreground">
                {networkFee} {selectedToken.symbol}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm font-medium text-foreground">
                Total
              </span>
              <span className="font-mono text-sm font-medium text-foreground">
                {estimatedTotal.toFixed(6)} {selectedToken.symbol}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Icon name="PaperAirplaneIcon" size={20} />
              <span>Send Tokens</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;