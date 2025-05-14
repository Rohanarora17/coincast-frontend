"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon } from "@heroicons/react/24/outline";

export const ConnectWalletSection = () => {
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-indigo-100 p-4 rounded-full">
          <WalletIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900">Connect Your Wallet</h2>
        <p className="text-gray-600 text-center mb-2">
          Connect with WalletConnect to get started with Token Reward Splitter
        </p>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
        <button 
              onClick={openConnectModal}
          className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg flex items-center justify-center transition-colors"
        >
          <WalletIcon className="mr-2 h-5 w-5" />
          Connect Wallet
        </button>
          )}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};