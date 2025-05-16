import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { getToken } from '@zoralabs/protocol-sdk';
import { base } from 'viem/chains';

interface TokenData {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  creator: string;
  createdAt: string;
  totalSupply: string;
  totalMinted: bigint;
  maxSupply: bigint;
  mintType: string;
  tokenURI: string;
}

// Define the type for getTokenParams to include tokenId
interface GetTokenParams {
  publicClient: any;
  tokenContract: `0x${string}`;
  mintType: string;
  chainId: number;
  chain: typeof base;
  tokenId?: string;
}

export function useZoraToken(tokenAddress: string | null, tokenId?: string | null) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['zoraToken', tokenAddress, tokenId],
    queryFn: async (): Promise<TokenData | null> => {
      if (!tokenAddress || !publicClient) {
        console.log('Missing token address or public client');
        return null;
      }

      try {
        console.log('Fetching token with address:', tokenAddress, 'tokenId:', tokenId);

        const getTokenParams: GetTokenParams = {
          publicClient,
          tokenContract: tokenAddress as `0x${string}`,
          mintType: '1155', // Zora posts are typically ERC-1155
          chainId: base.id,
          chain: base,
        };

        if (tokenId) {
          getTokenParams.tokenId = tokenId;
        }

        const { token } = await getToken(getTokenParams);
        console.log('Token details:', token);

        let metadata = null;
        if (token.tokenURI) {
          try {
            const response = await fetch(token.tokenURI);
            metadata = await response.json();
          } catch (error) {
            console.error('Error fetching token metadata:', error);
          }
        }

        return {
          name: metadata?.name || 'Unknown Token',
          symbol: metadata?.symbol || 'UNKNOWN',
          description: metadata?.description || '',
          imageUrl: metadata?.image || '',
          creator: token.creator,
          createdAt: new Date().toISOString(), // SDK doesn't provide this
          totalSupply: token.maxSupply.toString(),
          totalMinted: token.totalMinted,
          maxSupply: token.maxSupply,
          mintType: token.mintType,
          tokenURI: token.tokenURI,
        };
      } catch (error) {
        console.error('Error fetching token data:', error);
        return null;
      }
    },
    enabled: !!tokenAddress && !!publicClient,
    retry: 2,
    retryDelay: 1000,
  });
}