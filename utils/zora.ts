import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getRewardsBalances } from '@zoralabs/protocol-sdk';
import { Address } from 'viem';
import { zora } from 'viem/chains';
import {
  protocolRewardsABI,
  protocolRewardsAddress,
  zoraCreator1155FactoryImplABI,
  zoraCreator1155FactoryImplAddress,
} from '@zoralabs/protocol-deployments';
import { getProfile, getProfileBalances } from "@zoralabs/coins-sdk";
import { setApiKey } from "@zoralabs/coins-sdk";

// Zora API configuration
export const ZORA_API_KEY = process.env.NEXT_PUBLIC_ZORA_API_KEY || '';

console.log('Initializing Zora SDK with API key:', ZORA_API_KEY ? 'API key present' : 'No API key found');

// Set up your API key
setApiKey(ZORA_API_KEY);

// Chain configuration
export const ZORA_CHAIN = zora;
export const ZORA_CHAIN_ID = zora.id;

// Protocol addresses
export const PROTOCOL_REWARDS_ADDRESS = protocolRewardsAddress[ZORA_CHAIN_ID];
export const ZORA_CREATOR_FACTORY_ADDRESS = zoraCreator1155FactoryImplAddress[ZORA_CHAIN_ID];

// Types for profile and balances
export type ZoraProfile = {
  id: string;
  handle: string;
  avatar?: {
    small: string;
    medium: string;
    blurhash?: string;
  };
  username: string;
  displayName?: string;
  bio: string;
  website?: string;
  publicWallet: {
    walletAddress: string;
  };
  socialAccounts: {
    edges: Array<{
      node: {
        type: string;
        url: string;
      };
    }>;
  };
  linkedWallets: {
    edges: Array<{
      node: {
        walletType: "PRIVY" | "EXTERNAL" | "SMART_WALLET";
        walletAddress: string;
      };
    }>;
  };
};

export type ZoraBalance = {
  id?: string;
  token?: {
    id?: string;
    name?: string;
    symbol?: string;
    address?: string;
    chainId?: number;
    totalSupply?: string;
    marketCap?: string;
    volume24h?: string;
    createdAt?: string;
    uniqueHolders?: number;
    media?: {
      previewImage?: string;
      medium?: string;
      blurhash?: string;
    };
  };
  amount?: {
    amountRaw?: string;
    amountDecimal?: number;
  };
  valueUsd?: string;
  timestamp?: string;
};

// Hook to fetch user profile
export const useZoraProfile = () => {
  const { address } = useAccount();

  const fetchProfile = async (identifier?: string) => {
    if (!identifier && !address) return null;

    try {
      const response = await getProfile({
        identifier: identifier || address!,
      });

      return response?.data?.profile as ZoraProfile;
    } catch (error) {
      console.error('Error fetching Zora profile:', error);
      return null;
    }
  };

  return { fetchProfile };
};

// Hook to fetch user balances
export const useZoraBalances = () => {
  const { address } = useAccount();

  const fetchBalances = async (userAddress?: string, count: number = 20, after?: string) => {
    if (!userAddress && !address) return null;

    try {
      const response = await getProfileBalances({
        identifier: userAddress || address!,
        count,
        after,
      });

      return {
        balances: response?.data?.profile?.coinBalances?.edges?.map((edge: any) => edge.node) as ZoraBalance[],
        pageInfo: response?.data?.profile?.coinBalances?.pageInfo,
      };
    } catch (error) {
      console.error('Error fetching Zora balances:', error);
      return null;
    }
  };

  const fetchAllBalances = async (userAddress?: string) => {
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

// Example usage:
/*
const YourComponent = () => {
  const { fetchProfile } = useZoraProfile();
  const { fetchBalances, fetchAllBalances } = useZoraBalances();

  const handleFetchProfile = async () => {
    const profile = await fetchProfile();
    console.log('Profile:', profile);
  };

  const handleFetchBalances = async () => {
    const balances = await fetchBalances();
    console.log('Balances:', balances);
  };

  const handleFetchAllBalances = async () => {
    const allBalances = await fetchAllBalances();
    console.log('All Balances:', allBalances);
  };

  return (
    // Your component JSX
  );
};
*/ 