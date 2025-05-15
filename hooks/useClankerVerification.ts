import { useState } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { Address, checksumAddress } from 'viem';

// Clanker token details type
export type ClankerTokenDetails = {
  id: string; // Token ID
  address: Address; // Token contract address
  lpLockerAddress: Address; // LP Locker contract address
  name?: string;
  symbol?: string;
};

// Type for the token data returned by the contract
type ClankerToken = {
  tokenAddress: Address;
  tokenId: bigint;
  lpLockerAddress: Address;
};

interface VerificationError {
  type: 'NOT_FOUND' | 'NOT_OWNER' | 'NETWORK_ERROR' | 'INVALID_ID';
  message: string;
}

interface UseClankerVerificationReturn {
  verifyToken: (tokenAddress: string, userAddress: Address) => Promise<boolean>;
  isVerifying: boolean;
  error: VerificationError | null;
  tokenDetails: ClankerTokenDetails | null;
}

// Clanker Factory contract address
const CLANKER_FACTORY_ADDRESS = checksumAddress('0x2a787b2362021cc3eea3c24c4748a6cd5b687382') as Address;

// Clanker Factory ABI for the relevant function
const CLANKER_FACTORY_ABI = [
  {
    name: "getTokensDeployedByUser",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "tokenAddress", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "lpLockerAddress", type: "address" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export function useClankerVerification(): UseClankerVerificationReturn {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<VerificationError | null>(null);
  const [tokenDetails, setTokenDetails] = useState<ClankerTokenDetails | null>(null);

  const publicClient = usePublicClient();
  const { address: currentUserAddress } = useAccount();

  const verifyToken = async (tokenAddress: string, userAddress: Address): Promise<boolean> => {
    console.log('Starting Clanker token verification:', {
      tokenAddress,
      userAddress,
      chain: publicClient?.chain
    });

    if (!publicClient) {
      console.error('No public client available');
      setError({
        type: 'NETWORK_ERROR',
        message: 'Network connection error. Please try again.',
      });
      return false;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Format the token address
      const formattedTokenAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
      console.log('Verifying Clanker token:', {
        tokenAddress: formattedTokenAddress,
        userAddress,
        factoryAddress: CLANKER_FACTORY_ADDRESS
      });

      // Get all tokens deployed by the user
      const tokens = await publicClient.readContract({
        address: CLANKER_FACTORY_ADDRESS,
        abi: CLANKER_FACTORY_ABI,
        functionName: "getTokensDeployedByUser",
        args: [userAddress],
      }) as ClankerToken[];

      console.log("All tokens deployed by user:", tokens);

      // Find the matching token
      const tokenMatch = tokens.find((token) => 
        token.tokenAddress.toLowerCase() === formattedTokenAddress.toLowerCase()
      );
      console.log("Token match result:", {
        found: !!tokenMatch,
        searchedAddress: formattedTokenAddress,
        matchedToken: tokenMatch
      });

      if (!tokenMatch) {
        console.error('Token not found or user is not the creator');
        setError({
          type: 'NOT_OWNER',
          message: 'You are not the creator of this token. Only the token creator can create a campaign.',
        });
        return false;
      }

      const { tokenAddress: address, tokenId, lpLockerAddress } = tokenMatch;
      console.log('Token verification successful:', {
        address,
        tokenId: tokenId.toString(),
        lpLockerAddress
      });

      setTokenDetails({
        id: tokenId.toString(),
        address,
        lpLockerAddress,
      });

      return true;
    } catch (err) {
      console.error('Error verifying Clanker token:', err);
      setError({
        type: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Failed to verify token',
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyToken,
    isVerifying,
    error,
    tokenDetails,
  };
}