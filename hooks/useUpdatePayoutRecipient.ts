import { useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { Address } from 'viem';
import { updatePayoutRecipient as updateCoinPayoutRecipient } from "@zoralabs/coins-sdk";

interface UseUpdatePayoutRecipientReturn {
  updatePayoutRecipient: (coinAddress: Address, splitAddress: Address) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdatePayoutRecipient(): UseUpdatePayoutRecipientReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const updatePayoutRecipient = async (coinAddress: Address, splitAddress: Address): Promise<boolean> => {
    if (!publicClient || !walletClient) {
      const error = 'Wallet not connected';
      console.error('Payout recipient update failed:', error);
      setError(error);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting payout recipient update:', {
        coinAddress,
        splitAddress,
        walletClient: !!walletClient,
        publicClient: !!publicClient
      });

      const result = await updateCoinPayoutRecipient({
        coin: coinAddress,
        newPayoutRecipient: splitAddress
      }, walletClient, publicClient);

      console.log('Payout recipient update transaction sent successfully:', result);
      return true;
    } catch (err) {
      console.error('Error updating payout recipient:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payout recipient';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      console.log('Payout recipient update process completed');
    }
  };

  return {
    updatePayoutRecipient,
    isLoading,
    error,
  };
} 