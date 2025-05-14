import { useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { Address } from 'viem';

// ABI for the LP Locker contract
const LP_LOCKER_ABI = [
  {
    name: "updateCreatorRewardRecipient",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "newRecipient", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

interface UseUpdateClankerPayoutRecipientReturn {
  updatePayoutRecipient: (tokenId: string, lpLockerAddress: Address, splitAddress: Address) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateClankerPayoutRecipient(): UseUpdateClankerPayoutRecipientReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const updatePayoutRecipient = async (tokenId: string, lpLockerAddress: Address, splitAddress: Address): Promise<boolean> => {
    if (!publicClient || !walletClient) {
      const error = 'Wallet not connected';
      console.error('Clanker payout recipient update failed:', error);
      setError(error);
      return false;
    }

    // Validate tokenId
    if (!tokenId || isNaN(Number(tokenId))) {
      const errorMsg = 'Invalid token ID. Please provide a valid numeric token ID.';
      console.error('Clanker payout recipient update failed:', errorMsg);
      setError(errorMsg);
      return false;
    }

    // Validate addresses
    if (!splitAddress.startsWith('0x') || splitAddress.length !== 42 || !lpLockerAddress.startsWith('0x') || lpLockerAddress.length !== 42) {
      const errorMsg = 'Invalid address format. Please provide valid Ethereum addresses.';
      console.error('Clanker payout recipient update failed:', errorMsg);
      setError(errorMsg);
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting Clanker payout recipient update:', {
        tokenId,
        lpLockerAddress,
        splitAddress,
      });

      // Simulate contract interaction to update creator reward recipient
      const { request } = await publicClient.simulateContract({
        address: lpLockerAddress,
        abi: LP_LOCKER_ABI,
        functionName: "updateCreatorRewardRecipient",
        args: [BigInt(tokenId), splitAddress],
        account: walletClient.account,
      });

      // Send the transaction
      const hash = await walletClient.writeContract(request);
      console.log('Clanker payout recipient update transaction sent:', hash);

      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Clanker payout recipient update confirmed:', receipt);

      return true;
    } catch (err) {
      console.error('Error updating Clanker payout recipient:', err);
      let errorMessage = 'Failed to update payout recipient';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      console.log('Clanker payout recipient update process completed');
    }
  };

  return {
    updatePayoutRecipient,
    isLoading,
    error,
  };
}