"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export const ConnectWalletSection = () => {
  return (
    <div className="w-full max-w-2xl bg-gradient-to-r from-[#1A1D2A] to-[#24262F] p-6 rounded-xl shadow-xl border border-[#FFFFFF]/10 mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Left side */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-[#FFFFFF]/70 text-sm mb-3">Join the Coin Cast ecosystem and start participating in the revolution of token economies.</p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center bg-[#FFFFFF]/5 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#24E8AD] mr-1.5"></div>
              <span className="text-xs text-[#FFFFFF]/70">Secure</span>
            </div>
            <div className="flex items-center bg-[#FFFFFF]/5 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#F8C62B] mr-1.5"></div>
              <span className="text-xs text-[#FFFFFF]/70">Base Network</span>
            </div>
            <div className="flex items-center bg-[#FFFFFF]/5 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#7B3FEF] mr-1.5"></div>
              <span className="text-xs text-[#FFFFFF]/70">Multi-Chain</span>
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="w-full sm:w-auto">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="w-full sm:w-auto px-6 py-3 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white font-medium rounded-lg flex items-center justify-center transition-all"
              >
                <WalletIcon className="mr-2 h-5 w-5" />
                Connect Wallet
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  );
};