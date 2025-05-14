"use client";

import React from "react";
import { WalletIcon, ArrowsRightLeftIcon, ShareIcon } from "@heroicons/react/24/outline";

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl mb-8 sm:mb-10">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="bg-indigo-100 p-3 rounded-full mb-3 sm:mb-4">
          <WalletIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1 sm:mb-2">Connect</h3>
        <p className="text-gray-500 text-sm text-center">Connected with WalletConnect</p>
        <div className="mt-2 text-green-600 text-xs font-medium">✓ Complete</div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
        <div className="bg-indigo-100 p-3 rounded-full mb-3 sm:mb-4">
          <ArrowsRightLeftIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1 sm:mb-2">Split</h3>
        <p className="text-gray-500 text-sm text-center">Set percentages for each wallet address</p>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center sm:col-span-2 md:col-span-1 sm:max-w-xs sm:mx-auto md:max-w-none md:mx-0">
        <div className="bg-indigo-100 p-3 rounded-full mb-3 sm:mb-4">
          <ShareIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1 sm:mb-2">Receive</h3>
        <p className="text-gray-500 text-sm text-center">Everyone gets their share automatically</p>
      </div>
    </div>
  );
};