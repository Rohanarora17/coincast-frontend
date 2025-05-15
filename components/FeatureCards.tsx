"use client";

import React from "react";
import { WalletIcon, ArrowsRightLeftIcon, ShareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export const FeatureCards = () => {
  return (
    <div className="w-full max-w-3xl mb-8">
      <div className="relative">
        {/* Progress line connector */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-8 h-[calc(100%-32px)] w-0.5 bg-gradient-to-b from-[#7B3FEF] via-[#F8C62B] to-[#2A9BF6] hidden md:block"></div>
        
        {/* Steps */}
        <div className="flex flex-col space-y-6">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1D2A] border-2 border-[#7B3FEF] z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#7B3FEF]/20">
                <WalletIcon className="h-6 w-6 text-[#7B3FEF]" />
              </div>
            </div>
            <div className="flex-1 bg-[#1A1D2A] rounded-lg p-4 border border-[#FFFFFF]/10 md:mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white">Connect</h3>
                <div className="flex items-center text-[#24E8AD] text-sm">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </div>
              </div>
              <p className="text-[#FFFFFF]/70 text-sm">Connect with WalletConnect to start your journey with Coin Cast</p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1D2A] border-2 border-[#F8C62B] z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F8C62B]/20">
                <ArrowsRightLeftIcon className="h-6 w-6 text-[#F8C62B]" />
              </div>
            </div>
            <div className="flex-1 bg-[#1A1D2A] rounded-lg p-4 border border-[#FFFFFF]/10 md:mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white">Split</h3>
                <div className="bg-[#1A1D2A] border border-[#F8C62B]/40 w-6 h-6 rounded-full flex items-center justify-center">
                  <span className="text-[#F8C62B] text-xs">2</span>
                </div>
              </div>
              <p className="text-[#FFFFFF]/70 text-sm">Define how fees are shared across content creators and supporters</p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1D2A] border-2 border-[#2A9BF6] z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2A9BF6]/20">
                <ShareIcon className="h-6 w-6 text-[#2A9BF6]" />
              </div>
            </div>
            <div className="flex-1 bg-[#1A1D2A] rounded-lg p-4 border border-[#FFFFFF]/10 md:mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white">Receive</h3>
                <div className="bg-[#1A1D2A] border border-[#2A9BF6]/40 w-6 h-6 rounded-full flex items-center justify-center">
                  <span className="text-[#2A9BF6] text-xs">3</span>
                </div>
              </div>
              <p className="text-[#FFFFFF]/70 text-sm">Watch as everyone gets their share automatically when fees are generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};