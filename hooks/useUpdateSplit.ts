import { useCallback, useState } from "react";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { SplitV2Client } from "@0xsplits/splits-sdk";
import { Address } from "viem";
import {UpdateSplitV2Config} from "@0xsplits/splits-sdk/types";





export const useUpdateSplit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const updateSplit = useCallback(
    async ({
      splitAddress,
      recipients,
      distributorFeePercent = 1,
      totalAllocationPercent = 100,
    }: UpdateSplitV2Config) => {
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

        const response = await splitsClient.updateSplit({
          splitAddress,
          recipients,
          distributorFeePercent,
          totalAllocationPercent,
        });

        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to update split");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [chain, publicClient, walletClient]
  );

  return {
    updateSplit,
    isLoading,
    error,
  };
}; 