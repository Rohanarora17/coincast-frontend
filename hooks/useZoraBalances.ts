import { useAccount } from 'wagmi';
import { getProfileBalances } from "@zoralabs/coins-sdk";
import '~~/utils/zora'; // This will initialize the API key

export type ZoraBalance = { 
  id: string;
  token: {
    id: string;
    name: string;
    symbol: string;
    address: string;
    chainId: number;
    totalSupply: string;
    marketCap: string;
    volume24h: string;
    createdAt: string;
    uniqueHolders: number;
    media?: {
      previewImage?: string;
      medium?: string;
      blurhash?: string;
    };
  };
  amount: {
    amountRaw: string;
    amountDecimal: number;
  };
  valueUsd: string;
  timestamp: string;
};

export type ZoraBalancesResponse = {
  balances: ZoraBalance[];
  pageInfo?: {
    endCursor?: string;
    hasNextPage: boolean;
  };
};

export const useZoraBalances = () => {
  const { address } = useAccount();

  const fetchBalances = async (userAddress?: string, count: number = 20, after?: string): Promise<ZoraBalancesResponse | null> => {
    if (!userAddress && !address) return null;

    try {
      const response = await getProfileBalances({
        identifier: userAddress || address!,
        count,
        after,
      });
      console.log('response in useZoraBalances', response);

      return {
        balances: response?.data?.profile?.coinBalances?.edges?.map((edge: any) => edge.node) || [],
        pageInfo: response?.data?.profile?.coinBalances?.pageInfo,
      };
    } catch (error) {
      console.error('Error fetching Zora balances:', error);
      return null;
    }
  };

  const fetchAllBalances = async (userAddress?: string): Promise<ZoraBalance[] | null> => {
    if (!userAddress && !address) return null;

    let allBalances: ZoraBalance[] = [];
    let cursor: string | undefined;
    const pageSize = 20;

    try {
      do {
        const response = await getProfileBalances({
          identifier: userAddress || address!,
          count: pageSize,
          after: cursor,
        });

        const profile = response?.data?.profile;
        
        if (profile?.coinBalances?.edges) {
          const newBalances = profile.coinBalances.edges.map((edge: any) => edge.node);
          allBalances = [...allBalances, ...newBalances];
        }

        cursor = profile?.coinBalances?.pageInfo?.endCursor;
        
        if (!cursor || profile?.coinBalances?.edges?.length === 0) {
          break;
        }
      } while (true);

      return allBalances;
    } catch (error) {
      console.error('Error fetching all Zora balances:', error);
      return null;
    }
  };

  return { fetchBalances, fetchAllBalances };
}; 