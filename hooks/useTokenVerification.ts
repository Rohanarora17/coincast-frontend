import { useCallback, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from 'viem/chains'; 
import { formatEther } from 'viem';
import { useZoraProfile } from './useZoraProfile';

export type VerificationError = {
  type: 'NOT_FOUND' | 'NOT_OWNER' | 'NOT_MINTED' | 'NETWORK' | 'UNKNOWN';
  message: string;
};

export type CoinDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  symbol: string;
  totalSupply: string;
  totalVolume: string;
  volume24h: string;
  marketCap: string;
  createdAt?: string;
  creatorAddress?: string;
  creatorId?: string;
  uniqueHolders: number;
  mediaContent?: {
    previewImage?: {
      small: string;
      medium: string;
    };
  };
};

// Helper function to format USD values
const formatUSD = (value: number | string): string => {
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  } catch (error) {
    console.error('Error formatting USD value:', error);
    return '$0.00';
  }
};

export const useTokenVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<VerificationError | null>(null);
  const [coinDetails, setCoinDetails] = useState<CoinDetails | null>(null);
  const publicClient = usePublicClient();
  const { fetchProfile } = useZoraProfile();

  const verifyToken = useCallback(async (tokenAddress: string, userAddress: string) => {
    if (!publicClient) {
      setError({
        type: 'NETWORK',
        message: 'Blockchain client not available. Please check your connection.'
      });
      return false;
    }

    setIsVerifying(true);
    setError(null);
    setCoinDetails(null);

    try {
      const formattedAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
      
      console.log('Starting token verification with:', {
        tokenAddress: formattedAddress,
        userAddress,
        chain: base.id
      });

      // Fetch coin details
      const response = await getCoin({
        address: formattedAddress,
        chain: base.id
      });

      const coin = response.data?.zora20Token;
      console.log('Full coin response:', JSON.stringify(response, null, 2));
      console.log('Coin data:', JSON.stringify(coin, null, 2));

      if (!coin) {
        console.error('Coin not found in response');
        setError({
          type: 'NOT_FOUND',
          message: 'Coin not found. Please check the address and try again.'
        });
        return false;
      }

      // Fetch user profile
      console.log('Fetching user profile for address:', userAddress);
      const userProfile = await fetchProfile(userAddress);
      console.log('User profile response:', JSON.stringify(userProfile, null, 2));

      if (!userProfile) {
        console.error('User profile not found');
        setError({
          type: 'NOT_OWNER',
          message: 'Could not fetch user profile. Please try again.'
        });
        return false;
      }

      // Store coin details for later use
      setCoinDetails({
        id: coin.id,
        name: coin.name,
        description: coin.description,
        address: coin.address,
        symbol: coin.symbol,
        totalSupply: coin.totalSupply,
        totalVolume: coin.totalVolume,
        volume24h: coin.volume24h,
        marketCap: coin.marketCap,
        createdAt: coin.createdAt,
        creatorAddress: coin.creatorAddress,
        creatorId: coin.creatorProfile?.id,
        uniqueHolders: coin.uniqueHolders,
        mediaContent: coin.mediaContent ? {
          previewImage: coin.mediaContent.previewImage
        } : undefined
      });

      // Check if user is the creator by matching IDs
      const isOwner = userProfile.id === coin.creatorProfile?.id;
      console.log('Ownership verification:', {
        coinCreatorId: coin.creatorProfile?.id,
        userProfileId: userProfile.id,
        isOwner,
        coinCreatorAddress: coin.creatorAddress,
        userAddress
      });

      if (!isOwner) {
        setError({
          type: 'NOT_OWNER',
          message: 'You must be the creator of this coin to create a campaign.'
        });
        return false;
      }

      // Check if coin has been minted (has supply)
      console.log('Supply check:', {
        totalSupply: coin.totalSupply,
        isMinted: BigInt(coin.totalSupply) > 0n,
        uniqueHolders: coin.uniqueHolders
      });

      if (BigInt(coin.totalSupply) <= 0n) {
        setError({
          type: 'NOT_MINTED',
          message: 'This coin has not been minted yet. Please mint it before creating a campaign.'
        });
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error verifying coin:', err);
     
      let errorMessage = 'Failed to verify coin';
      let errorType: VerificationError['type'] = 'UNKNOWN';

      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('connection')) {
          errorType = 'NETWORK';
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('not found')) {
          errorType = 'NOT_FOUND';
          errorMessage = 'Coin not found. Please check the address and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setError({
        type: errorType,
        message: errorMessage
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [publicClient, fetchProfile]);

  return {
    verifyToken,
    isVerifying,
    error,
    coinDetails
  };
}; 