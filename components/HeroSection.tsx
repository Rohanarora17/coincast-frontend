"use client";

import React, { FC } from "react";
import { useAccount } from "wagmi";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ConnectWalletSection } from "./ConnectWalletSection";
import { FeatureCards } from "./FeatureCards";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const { isConnected } = useAccount();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-center max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
        Split Your Token Rewards <span className="text-indigo-600">Automatically</span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl">
        The easiest way to share your Base network token rewards with team members, contributors, or our platform—no crypto expertise required.
      </p>
      
      {!isConnected ? (
        <ConnectWalletSection />
      ) : (
        <>
          <FeatureCards />
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full sm:w-auto">
            <button 
              onClick={onGetStarted}
              className="px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
            <button className="px-6 sm:px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center">
              Learn More
            </button>
          </div>
        </>
      )}
    </div>
  );
};