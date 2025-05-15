"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon } from "@heroicons/react/24/outline";

interface WalletConnectionOverlayProps {
  isOpen: boolean;
}

export const WalletConnectionOverlay = ({ isOpen }: WalletConnectionOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-[#1A1D2A]/80 backdrop-blur-md" />
      
      {/* Modal content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#24262F] rounded-xl shadow-xl border border-[#FFFFFF]/10 p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-[#FFFFFF]/70 text-sm">
              Please connect your wallet to create a campaign and participate in the Coin Cast ecosystem.
            </p>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center bg-[#FFFFFF]/5 px-3 py-1.5 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#24E8AD] mr-1.5"></div>
              <span className="text-xs text-[#FFFFFF]/70">Secure</span>
            </div>
            <div className="flex items-center bg-[#FFFFFF]/5 px-3 py-1.5 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#F8C62B] mr-1.5"></div>
              <span className="text-xs text-[#FFFFFF]/70">Base Network</span>
            </div>
            <div className="flex items-center bg-[#FFFFFF]/5 px-3 py-1.5 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#7B3FEF] mr-1.5"></div>
              <span className="text-xs text-[#FFFFFF]/70">Multi-Chain</span>
            </div>
          </div>
          
          {/* Connect button */}
          <div className="flex justify-center">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="w-full px-6 py-3 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white font-medium rounded-lg flex items-center justify-center transition-all"
                >
                  <WalletIcon className="mr-2 h-5 w-5" />
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </div>
  );
}; 