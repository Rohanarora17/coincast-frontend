"use client";

import { Address, formatEther } from "viem";
import { useDisplayUsdMode } from "~~/hooks/scaffold-eth/useDisplayUsdMode";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useGlobalState } from "~~/services/store/store";
import { CurrencyDollarIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

type BalanceProps = {
  address?: Address;
  className?: string;
  usdMode?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const Balance = ({ address, className = "", usdMode }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);

  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
  });

  const { displayUsdMode, toggleDisplayUsdMode } = useDisplayUsdMode({ defaultUsdMode: usdMode });

  if (!address || isLoading || balance === null || (isNativeCurrencyPriceFetching && nativeCurrencyPrice === 0)) {
    return (
      <div className="animate-pulse flex items-center space-x-2">
        <div className="rounded-md bg-[#FFFFFF]/10 h-5 w-20"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 py-1 bg-[#FF5C6A]/10 text-[#FF5C6A] text-xs rounded-md flex items-center">
        <span>Error loading balance</span>
      </div>
    );
  }

  const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;

  return (
    <button
      className={`flex items-center px-2 py-1 text-sm rounded-md hover:bg-[#FFFFFF]/5 transition-colors ${className}`}
      onClick={toggleDisplayUsdMode}
      type="button"
    >
      {displayUsdMode ? (
        <div className="flex items-center text-[#24E8AD]">
          <CurrencyDollarIcon className="h-3.5 w-3.5 mr-1" />
          <span>{(formattedBalance * nativeCurrencyPrice).toFixed(2)}</span>
        </div>
      ) : (
        <div className="flex items-center text-white">
          <span>{formattedBalance.toFixed(4)}</span>
          <span className="text-xs ml-1 text-[#FFFFFF]/70">{targetNetwork.nativeCurrency.symbol}</span>
        </div>
      )}
      <ArrowsRightLeftIcon className="h-3 w-3 ml-1 text-[#FFFFFF]/40" />
    </button>
  );
};