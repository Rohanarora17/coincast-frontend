"use client";

import React from "react";
import { ArrowRightIcon, FireIcon, SparklesIcon } from "@heroicons/react/24/outline";

export const UserActionButtons = ({ onCreateCampaign }: { onCreateCampaign: () => void }) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
      <button 
        onClick={onCreateCampaign}
        className="px-8 py-3 rounded-lg font-medium bg-[#7B3FEF] hover:bg-[#6A35D0] text-white transition-all transform hover:scale-105 flex items-center justify-center"
      >
        Create Campaign
        <ArrowRightIcon className="ml-2 h-5 w-5" />
      </button>
      <button 
        onClick={() => window.location.href = '/view-campaigns'}
        className="px-8 py-3 rounded-lg font-medium bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/15 border border-[#FFFFFF]/20 text-white transition-all flex items-center justify-center"
      >
        <SparklesIcon className="mr-2 h-5 w-5 text-[#F8C62B]" />
        View Campaigns
      </button>
    </div>
  );
};