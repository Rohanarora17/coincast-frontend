"use client";

import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";
import { WalletIcon } from "@heroicons/react/24/outline";

export const RainbowKitCustomConnectButton = ({ text }: { text: string }) => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

        return (
          <div className="flex items-center">
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="px-3 py-2 sm:px-4 sm:py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base min-h-[40px] sm:min-h-[44px] touch-manipulation"
                    onClick={openConnectModal}
                    type="button"
                    aria-label="Connect Wallet"
                  >
                    <WalletIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="truncate">{text}</span>
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                  <div className="flex flex-col items-center min-w-0">
                    <Balance
                      address={account.address as Address}
                      className="min-h-0 h-auto text-white text-sm sm:text-base"
                    />
                    <span
                      className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]"
                      style={{ color: networkColor }}
                    >
                      {chain.name}
                    </span>
                  </div>
                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};