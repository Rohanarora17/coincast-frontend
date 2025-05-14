import { useAccount, usePublicClient } from 'wagmi';
import { getRewardsBalances } from '@zoralabs/protocol-sdk';
import { base } from 'viem/chains';
import { formatEther } from 'viem';

export type ZoraRewards = {
  protocolRewards: bigint;
  secondaryRoyalties: {
    eth: bigint;
    erc20: Record<string, bigint>;
  };
  isClaimed: boolean;
};

export const useZoraRewards = () => {
  const address = '0x28172273cc1e0395f3473ec6ed062b6fdfb15940';
  const publicClient = usePublicClient({
    chainId: base.id
  });

  const fetchRewards = async () => {
    if (!address || !publicClient) {
      console.log('No address or public client available');
      return null;
    }

    try {
      console.log('Fetching rewards for address:', address);
      const rewardsBalance = await getRewardsBalances({
        account: address,
        publicClient,
      });



      const rewards: ZoraRewards = {
        protocolRewards: rewardsBalance.protocolRewards,
        secondaryRoyalties: {
          eth: rewardsBalance.secondaryRoyalties.eth,
          erc20: rewardsBalance.secondaryRoyalties.erc20,
        },
        isClaimed: false,
      };

      // Format rewards for better readability
      const formattedRewards = {
        protocolRewards: {
          wei: rewards.protocolRewards.toString(),
          eth: formatEther(rewards.protocolRewards)
        },
        secondaryRoyalties: {
          eth: {
            wei: rewards.secondaryRoyalties.eth.toString(),
            eth: formatEther(rewards.secondaryRoyalties.eth)
          },
          erc20: Object.entries(rewards.secondaryRoyalties.erc20).map(([token, amount]) => ({
            token,
            wei: amount.toString(),
            eth: formatEther(amount)
          }))
        },
        isClaimed: rewards.isClaimed
      };

      console.log('Formatted Rewards:', formattedRewards);
      return formattedRewards;
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return null;
    }
  };

  return { fetchRewards };
}; 