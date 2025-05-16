import { useAccount } from 'wagmi';
import { getProfile } from "@zoralabs/coins-sdk";
import '~~/utils/zora'; // This will initialize the API key

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

export const useZoraProfile = () => {
  const { address } = useAccount();

  const fetchProfile = async (identifier?: string) => {
    if (!identifier && !address) return null;

    try {
      const response = await getProfile({
        identifier: identifier || address!,
      });
      console.log('response in useZoraProfile', response);

      return response?.data?.profile as ZoraProfile;
    } catch (error) {
      console.error('Error fetching Zora profile:', error);
      return null;
    }
  };

  return { fetchProfile };
}; 