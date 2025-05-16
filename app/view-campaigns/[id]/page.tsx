"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Campaign } from "../page";
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Footer } from "~~/components/Footer";
import ResponsiveHeader from "~~/components/Header";
import { BACKEND_URL } from "~~/constants";

const CampaignViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const campaignId = params.id as string;
    // const foundCampaign = mockCampaigns.find(c => c.id === campaignId);
    if (!campaignId) return;

    async function fetchCampaign() {
      const data = await fetch(`${BACKEND_URL}/bounty/keyword/${campaignId}`);

      const response = await data.json();

      console.log("response", response);

      setCampaign(response || null);
      setIsLoading(false);
    }

    fetchCampaign();
  }, [params.id]);

  const getStatusUI = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#24E8AD]/20 text-[#24E8AD]">Active</span>
        );
      case "upcoming":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F8C62B]/20 text-[#F8C62B]">Upcoming</span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FF5C6A]/20 text-[#FF5C6A]">Completed</span>
        );
      default:
        return null;
    }
  };

  const DynamicBackground = () => (
    <div className="absolute inset-0 z-0">
      <div className="absolute top-0 left-0 w-full h-full bg-[#1A1D2A]">
        {/* Node Network Animation */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="absolute w-2 h-2 rounded-full bg-[#7B3FEF]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse 3s infinite ${Math.random() * 2}s`,
            }}
          />
        ))}

        {[...Array(15)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute bg-[#2A9BF6]"
            style={{
              height: "1px",
              width: `${30 + Math.random() * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1D2A] text-white">
        <ResponsiveHeader navItems={[]} activeSection="view" logo={{ text: "COIN CAST" }} />
        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-[#FFFFFF]/10 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-[#FFFFFF]/10 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-[#FFFFFF]/10 rounded w-3/4"></div>
                <div className="h-4 bg-[#FFFFFF]/10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#1A1D2A] text-white">
        <ResponsiveHeader navItems={[]} activeSection="view" logo={{ text: "COIN CAST" }} />
        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
              <p className="text-[#FFFFFF]/70 mb-8">
                The campaign you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.push("/view-campaigns")}
                className="px-6 py-3 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white rounded-lg transition-colors"
              >
                Back to Campaigns
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1D2A] text-white">
      <ResponsiveHeader navItems={[]} activeSection="view" logo={{ text: "COIN CAST" }} />

      <main className="pt-32 pb-20 relative">
        <DynamicBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <button
            onClick={() => router.push("/view-campaigns")}
            className="flex items-center text-[#FFFFFF]/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Campaigns
          </button>

          {/* Campaign Header */}
          <div className="bg-[#24262F]/70 backdrop-blur-lg rounded-xl p-6 border border-[#FFFFFF]/10 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-[#1A1D2A] flex items-center justify-center mr-4">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: campaign.logo }}></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">{campaign.name}</h1>
                  <p className="text-[#FFFFFF]/60">by {campaign.creatorAddress}</p>
                </div>
              </div>
              {getStatusUI(campaign.status)}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-[#24262F]/70 backdrop-blur-lg rounded-xl p-6 border border-[#FFFFFF]/10 mb-8">
                <h2 className="text-xl font-bold mb-4">About Campaign</h2>
                <p className="text-[#FFFFFF]/80 leading-relaxed">{campaign.description}</p>
              </div>

              {/* Campaign Stats */}
              <div className="bg-[#24262F]/70 backdrop-blur-lg rounded-xl p-6 border border-[#FFFFFF]/10">
                <h2 className="text-xl font-bold mb-4">Campaign Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#FFFFFF]/10">
                    <span className="text-[#FFFFFF]/60">Status</span>
                    <span className="font-medium">
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#FFFFFF]/10">
                    <span className="text-[#FFFFFF]/60">
                      {campaign.status === "active" ? "Ends" : campaign.status === "upcoming" ? "Starts" : "Ended"}
                    </span>
                    <span className="font-medium">
                      {campaign.status === "active"
                        ? new Date(campaign.campaignEndDate).toLocaleDateString()
                        : campaign.status === "upcoming"
                          ? new Date(campaign.campaignStartDate).toLocaleDateString()
                          : new Date(campaign.campaignEndDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[#FFFFFF]/60">Creator</span>
                    <span className="font-medium">{campaign.creatorAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#24262F]/70 backdrop-blur-lg rounded-xl p-6 border border-[#FFFFFF]/10 sticky top-32">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  {campaign.status === "active" && (
                    <a
                      href={"https://warpcast.com/farcaster/" + campaign.hash}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-3 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Participate Now
                    </a>
                  )}

                  {campaign.status === "upcoming" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FFFFFF]/5 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <ClockIcon className="w-6 h-6 text-[#F8C62B] mr-2" />
                          <span className="text-[#F8C62B] font-medium">Campaign Starts Soon</span>
                        </div>
                        <p className="text-sm text-[#FFFFFF]/70 text-center">
                          This campaign will begin on {campaign.startDate.toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        disabled
                        className="w-full px-4 py-3 bg-[#FFFFFF]/10 text-[#FFFFFF]/40 font-medium rounded-lg cursor-not-allowed flex items-center justify-center"
                      >
                        <ClockIcon className="w-5 h-5 mr-2" />
                        Participation Starts Soon
                      </button>
                    </div>
                  )}

                  {campaign.status === "completed" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FFFFFF]/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#FFFFFF]/60">Participants</span>
                          <span className="font-medium">{campaign.participants}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#FFFFFF]/60">Total Rewards</span>
                          <span className="font-medium">{campaign.budgetPercentage}</span>
                        </div>
                      </div>
                      <button
                        disabled
                        className="w-full px-4 py-3 bg-[#FFFFFF]/10 text-[#FFFFFF]/40 font-medium rounded-lg cursor-not-allowed flex items-center justify-center"
                      >
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Campaign Ended
                      </button>
                    </div>
                  )}

                  <button className="w-full px-4 py-3 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/15 text-white font-medium rounded-lg transition-colors">
                    Share Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CampaignViewPage;
