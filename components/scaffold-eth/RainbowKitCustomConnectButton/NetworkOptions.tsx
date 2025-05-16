import { useCallback, useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

const networkColors: Record<number, string> = {
  1: "bg-[#3B82F6]", // Ethereum
  5: "bg-[#3B82F6]", // Goerli
  11155111: "bg-[#3B82F6]", // Sepolia
  137: "bg-[#8247E5]", // Polygon
  80001: "bg-[#8247E5]", // Mumbai
  42161: "bg-[#28A0F0]", // Arbitrum
  421613: "bg-[#28A0F0]", // Arbitrum Goerli
  10: "bg-[#FF0420]", // Optimism
  420: "bg-[#FF0420]", // Optimism Goerli
  8453: "bg-[#0052FF]", // Base
  84531: "bg-[#0052FF]", // Base Goerli
  84532: "bg-[#0052FF]", // Base Sepolia
  534353: "bg-[#FF0420]", // Scroll
  534351: "bg-[#FF0420]", // Scroll Sepolia
  1101: "bg-[#8247E5]", // Polygon zkEVM
  1442: "bg-[#8247E5]", // Polygon zkEVM Testnet
  324: "bg-[#8247E5]", // zkSync
  280: "bg-[#8247E5]", // zkSync Testnet
  7777777: "bg-[#8247E5]", // Zora
  999: "bg-[#8247E5]", // Zora Testnet
};

export const NetworkOptions = ({ hidden }: { hidden: boolean }) => {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isPending, setIsPending] = useState(false);

  const handleSwitchNetwork = useCallback(
    (chainId: number) => {
      if (switchChain) {
        setIsPending(true);
        switchChain({ chainId });
      }
    },
    [switchChain],
  );

  useEffect(() => {
    if (chain) {
      setIsPending(false);
    }
  }, [chain]);

  if (hidden) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {allowedNetworks.map(allowedNetwork => {
        const isCurrentChain = chain?.id === allowedNetwork.id;
        const isPendingChain = isPending && chain?.id === allowedNetwork.id;

        return (
          <button
            key={allowedNetwork.id}
            onClick={() => handleSwitchNetwork(allowedNetwork.id)}
            disabled={isCurrentChain || isPending}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-[#FFFFFF]/5 text-white rounded-lg w-full text-left touch-manipulation ${
              isCurrentChain ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${networkColors[allowedNetwork.id] || "bg-[#FFFFFF]/70"}`} />
            <span className="text-sm">{allowedNetwork.name}</span>
            {isPendingChain && <span className="text-sm text-[#FFFFFF]/70">(switching...)</span>}
          </button>
        );
      })}
    </div>
  );
};