import { useState } from 'react';
import { SplitV2Client } from '@0xsplits/splits-sdk';
import { usePublicClient, useWalletClient, useAccount, useChainId } from 'wagmi';
import { base } from 'viem/chains';
import { Address } from 'viem';
import { SplitV2Type, CreateSplitV2Config, CreateSplitConfig} from '@0xsplits/splits-sdk/types';

interface UseSplitReturn {
  createProtocolSplit: (budgetPercentage: number, postTokenAddress: Address) => Promise<Address | null>;
  isLoading: boolean;
  error: string | null;
  splitAddress: Address | null;
}

export function useSplit(): UseSplitReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [splitAddress, setSplitAddress] = useState<Address | null>(null);
  
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address: creatorAccount } = useAccount();
  const chainId = useChainId(); // Get the current chain ID from the connected wallet

  const createProtocolSplit = async (budgetPercentage: number, postTokenAddress: Address): Promise<Address | null> => {
    console.log('Starting split creation for post:', postTokenAddress);
    console.log('Split details:', {
      budgetPercentage,
      postTokenAddress,
      creatorAccount,
      chainId // Log the chain ID being used
    });

    if (!publicClient || !walletClient || !creatorAccount) {
      const error = 'Wallet not connected';
      console.error('Split creation failed:', error);
      setError(error);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Initializing SplitV2Client with chain ID:', chainId);
      // Setup splits client with the wallet's current chain ID
      const splitsClient = new SplitV2Client({
        chainId, // Use the chain ID from the connected wallet
        publicClient,
        walletClient,
        apiConfig: {
          apiKey: process.env.NEXT_PUBLIC_SPLIT_API_KEY || '',
        },
      });
      console.log('SplitV2Client initialized successfully');

      // Protocol address - replace with actual protocol address
      const protocolAddress = process.env.NEXT_PUBLIC_PROTOCOL_ADDRESS as Address;
      console.log('Protocol address:', protocolAddress);
      console.log('Creator address:', creatorAccount);

      // Validate addresses are different
      if (protocolAddress.toLowerCase() === creatorAccount.toLowerCase()) {
        throw new Error('Protocol address cannot be the same as creator address');
      }

      // Configure the split between protocol and creator for this specific post
      const args : CreateSplitV2Config = {
        recipients: [
          {
            address: protocolAddress,
            percentAllocation: budgetPercentage,
          },
          {
            address: creatorAccount,
            percentAllocation: 100 - budgetPercentage,
          },
        ],
        splitType: SplitV2Type.Pull,
        distributorFeePercent: 0,
        totalAllocationPercent: 100,
        ownerAddress: protocolAddress,
        creatorAddress: protocolAddress,
        // Add a deterministic salt based on the post token address
        salt: `0x${postTokenAddress.slice(2).padStart(64, '0')}` as `0x${string}`,
      };
      console.log('Split configuration:', args);

      // Get the deterministic split address
      console.log('Predicting split address...');
      const predicted = await splitsClient.predictDeterministicAddress(args);
      console.log('Predicted split address:', predicted);

      // Check if split already exists
      const isDeployed = await splitsClient.isDeployed(args);
      console.log('Is split deployed:', isDeployed);

      if (!isDeployed.deployed) {
        console.log('Split does not exist, creating new split...');
        // Create the split
        const response = await splitsClient.createSplit(args);
        console.log('Split creation response:', response);
        setSplitAddress(response.splitAddress);
        return response.splitAddress;
      } else {
        console.log('Split already exists for this post, using existing split address');
        setSplitAddress(predicted.splitAddress);
        return predicted.splitAddress;
      }
    } catch (err) {
      console.error('Error in split creation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create split';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
      console.log('Split creation process completed');
    }
  };

  return {
    createProtocolSplit,
    isLoading,
    error,
    splitAddress,
  };
} 