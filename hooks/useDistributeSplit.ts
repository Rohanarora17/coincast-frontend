import { useCallback, useState } from "react";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { SplitV2Client } from "@0xsplits/splits-sdk";
import { Address } from "viem";

interface DistributeSplitArgs {
  splitAddress: Address;
  tokenAddress: Address;
  distributorAddress?: Address;
}

export const useDistributeSplit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const distributeSplit = useCallback(
    async ({ splitAddress, tokenAddress, distributorAddress }: DistributeSplitArgs) => {
      if (!chain || !publicClient || !walletClient) {
        throw new Error("Missing required clients");
      }

      setIsLoading(true);
      setError(null);

      try {
        const splitsClient = new SplitV2Client({
          chainId: chain.id,
          publicClient,
          walletClient,
        });

        const response = await splitsClient.distribute({
          splitAddress,
          tokenAddress,
          distributorAddress,
        });

        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to distribute split");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [chain, publicClient, walletClient]
  );

  return {
    distributeSplit,
    isLoading,
    error,
  };
}; 