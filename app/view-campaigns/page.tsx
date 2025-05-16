"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockCampaigns } from "./mockCampaigns";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  FireIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Footer } from "~~/components/Footer";
import ResponsiveHeader from "~~/components/Header";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { BACKEND_URL } from "~~/constants";

// Import the shared mock data

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "upcoming" | "completed";
  creatorAddress: string;
  logo: string;
  description: string;
  endDate: Date;
  uniqueKeyword: string;
  campaignStartDate: Date;
  campaignEndDate: Date;
  raisedAmount: number;
  participants: number;
  category: string;
  hash: string;
  budgetPercentage: number;
  startDate: Date; // Added for consistency, though not used here yet
}

const CampaignsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sortedCampaigns, setSortedCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch campaigns based on the active tab
  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      let endpoint = "";

      // Set the appropriate API endpoint based on the active tab
      switch (activeTab) {
        case "active":
          endpoint = `${BACKEND_URL}/bounty/active`;
          break;
        case "upcoming":
          endpoint = `${BACKEND_URL}/bounty/upcoming`;
          break;
        case "completed":
          endpoint = `${BACKEND_URL}/bounty/completed`;
          break;
        default:
          endpoint = `${BACKEND_URL}/bounty/active`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns. Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("data is", data);

      // Process the data to ensure dates are properly formatted
      const processedData = data.map((campaign: any) => ({
        ...campaign,
        endDate: new Date(campaign.campaignEndDate),
      }));

      console.log("processed data", processedData);

      // Filter campaigns based on search query and category
      const filteredCampaign = processedData.filter((campaign: Campaign) => {
        // Filter by search query
        if (
          searchQuery &&
          !campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !campaign.creatorAddress?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;

        // Filter by category
        if (filterCategory !== "all" && campaign.category !== filterCategory) return false;

        return true;
      });

      // Sort campaigns
      const sortedCampa = [...filteredCampaign].sort((a: Campaign, b: Campaign) => {
        switch (sortBy) {
          case "newest":
            return b.campaignEndDate.getTime() - a.campaignEndDate.getTime();
          case "oldest":
            return a.campaignEndDate.getTime() - b.campaignEndDate.getTime();
          case "mostFunded":
            return b.raisedAmount - a.raisedAmount;
          case "mostParticipants":
            return b.participants - a.participants;
          default:
            return 0;
        }
      });

      console.log("sorted campaign", sortedCampa);
      setCampaigns(processedData);
      setFilteredCampaigns(filteredCampaign);
      setSortedCampaigns(sortedCampa);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Fetch campaigns when the active tab changes
  useEffect(() => {
    fetchCampaigns();
  }, [activeTab, fetchCampaigns]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTimeRemaining = (endDate: Date): string => {
    console.log("end date is", endDate);

    const total = new Date(endDate).getTime() - new Date().getTime();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    if (total < 0) {
      return "Ended";
    }

    return `${days}d ${hours}h`;
  };

  // Generate dynamic status UI based on campaign status
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

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset filters when changing tabs
    setSearchQuery("");
    setFilterCategory("all");
    setSortBy("newest");
  };

  // Retry function for API fetch errors
  const handleRetry = () => {
    fetchCampaigns();
  };

  return (
    <div className="min-h-screen bg-[#1A1D2A] text-white">
      <ResponsiveHeader
        navItems={[
          { id: "home", label: "Home", onClick: () => (window.location.href = "/") },
          { id: "dashboard", label: "Dashboard", onClick: () => (window.location.href = "/dashboard") },
          { id: "create", label: "Create Campaign", onClick: () => (window.location.href = "/create-campaign") },
          { id: "view-campaigns", label: "View Campaigns", onClick: () => (window.location.href = "/view-campaigns") },
        ]}
        activeSection="view-campaigns"
        logo={{
          text: "COIN CAST",
          icon: (
            <div className="w-10 h-10 rounded-full bg-[#7B3FEF] flex items-center justify-center">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#F8C62B] rounded-full"></div>
              </div>
            </div>
          ),
        }}
      />

      <main className="pt-32 pb-20">
        {/* Hero Section with Background Effects */}
        <div className="relative overflow-hidden mb-12">
          {/* Background Animation Effects */}
          <div className="absolute inset-0 z-0">
            {/* Node Network */}
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(15)].map((_, i) => (
                <div
                  key={`node-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-[#7B3FEF]"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.4,
                    animation: `pulse 3s infinite ${Math.random() * 2}s`,
                  }}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`connection-${i}`}
                  className="absolute bg-[#2A9BF6]"
                  style={{
                    height: "1px",
                    width: `${20 + Math.random() * 60}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    opacity: 0.2,
                  }}
                />
              ))}
            </div>

            {/* Wave Forms */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`wave-${i}`}
                className="absolute w-full h-12"
                style={{
                  bottom: 40 + i * 30,
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "#7B3FEF" : "#2A9BF6"}, transparent)`,
                  opacity: 0.05,
                  transform: `skewY(${1 - i / 2}deg)`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#FFFFFF]/5 rounded-full border border-[#FFFFFF]/10 mb-5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#24E8AD] animate-pulse"></span>
                <span className="text-sm font-medium text-[#FFFFFF]/80">
                  {filteredCampaigns.length} Campaigns Available
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6]">
                  Discover Campaigns
                </span>
              </h1>
              <p className="text-lg text-[#FFFFFF]/80 max-w-2xl mx-auto">
                Find and support token campaigns that align with your interests. Connect with creators and share in
                their success.
              </p>
            </div>

            {/* Status Tabs */}
            <div className="flex space-x-2 mb-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-[#7B3FEF] text-white"
                    : "bg-[#FFFFFF]/5 text-[#FFFFFF]/70 hover:bg-[#FFFFFF]/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "active"
                    ? "bg-[#7B3FEF] text-white"
                    : "bg-[#FFFFFF]/5 text-[#FFFFFF]/70 hover:bg-[#FFFFFF]/10"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "upcoming"
                    ? "bg-[#7B3FEF] text-white"
                    : "bg-[#FFFFFF]/5 text-[#FFFFFF]/70 hover:bg-[#FFFFFF]/10"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "completed"
                    ? "bg-[#7B3FEF] text-white"
                    : "bg-[#FFFFFF]/5 text-[#FFFFFF]/70 hover:bg-[#FFFFFF]/10"
                }`}
              >
                Completed
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-[#24262F]/70 backdrop-blur-lg rounded-xl p-5 border border-[#FFFFFF]/10 mb-10 shadow-lg shadow-[#7B3FEF]/5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFFF]/40" />
                  <input
                    type="text"
                    placeholder="Search by name, creator, or description..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1D2A] border border-[#FFFFFF]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3FEF] text-white placeholder-[#FFFFFF]/40 transition-all"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-[#1A1D2A] border border-[#FFFFFF]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3FEF] text-white transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFFF]/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#24262F] rounded-xl overflow-hidden border border-[#FFFFFF]/10 animate-pulse"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1A1D2A] mr-3"></div>
                        <div>
                          <div className="h-5 bg-[#1A1D2A] rounded w-32 mb-2"></div>
                          <div className="h-4 bg-[#1A1D2A] rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-[#1A1D2A] rounded w-full mb-2"></div>
                      <div className="h-4 bg-[#1A1D2A] rounded w-3/4 mb-6"></div>
                      <div className="h-2 bg-[#1A1D2A] rounded-full w-full mb-4"></div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="h-10 bg-[#1A1D2A] rounded"></div>
                        <div className="h-10 bg-[#1A1D2A] rounded"></div>
                        <div className="h-10 bg-[#1A1D2A] rounded"></div>
                      </div>
                      <div className="h-10 bg-[#1A1D2A] rounded-lg w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-[#24262F]/80 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-[#FFFFFF]/10 shadow-lg">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#1A1D2A] border border-[#FFFFFF]/10 flex items-center justify-center">
                    <FunnelIcon className="h-8 w-8 text-[#FFFFFF]/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">No campaigns found</h3>
                  <p className="text-[#FFFFFF]/70 mb-6">
                    We couldn't find any campaigns matching your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSortBy("newest");
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-[#7B3FEF]/20"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCampaigns.map(campaign => (
                  <div
                    key={campaign.uniqueKeyword}
                    onClick={() => router.push(`/view-campaigns/${campaign.uniqueKeyword}`)}
                    className="bg-[#24262F]/70 backdrop-blur-lg rounded-xl p-6 border border-[#FFFFFF]/10 hover:border-[#7B3FEF]/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-[#1A1D2A] flex items-center justify-center mr-3">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: campaign.logo }}></div>
                        </div>
                        <div>
                          <h3 className="font-medium group-hover:text-[#7B3FEF] transition-colors">{campaign.name}</h3>
                          <p className="text-sm text-[#FFFFFF]/60">
                            {campaign?.creatorAddress?.substring(0, 6)}...{campaign?.creatorAddress?.slice(38)}
                          </p>
                        </div>
                      </div>
                      {getStatusUI(campaign.status)}
                    </div>
                    <p className="text-sm text-[#FFFFFF]/70 mb-4 line-clamp-2">{campaign.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#FFFFFF]/60">
                        {campaign.status === "active"
                          ? `Ends ${new Date(campaign.campaignEndDate).toLocaleDateString()}`
                          : campaign.status === "upcoming"
                            ? `Starts ${new Date(campaign.campaignStartDate).toLocaleDateString()}`
                            : `Ends on ${new Date(campaign.campaignEndDate).toLocaleDateString()}`}
                      </span>
                      <span className="text-[#7B3FEF] group-hover:underline">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Campaign CTA */}
            {activeTab !== "completed" && (
              <div className="mt-16 max-w-5xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl bg-[#24262F] border border-[#FFFFFF]/10">
                  {/* Background effect */}
                  <div className="absolute inset-0 w-full h-full z-0">
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#7B3FEF]/20 blur-3xl -mr-24 -mt-24"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#2A9BF6]/20 blur-3xl -ml-24 -mb-24"></div>
                    {/* Wave animation */}
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`wave-cta-${i}`}
                        className="absolute w-full h-8"
                        style={{
                          bottom: 30 + i * 20,
                          background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "#7B3FEF" : "#2A9BF6"}, transparent)`,
                          opacity: 0.05,
                          transform: `skewY(${1 - i / 2}deg)`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Launch Your Token Campaign?</h2>
                        <p className="text-[#FFFFFF]/80 max-w-xl">
                          Create a token campaign to connect with content creators and build a thriving community around
                          your project. Share your success with creators who promote your vision.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => router.push("/create-campaign")}
                          className="px-6 py-3 bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] hover:opacity-90 text-white font-medium rounded-lg transition-all transform hover:scale-105 flex items-center justify-center shadow-lg shadow-[#7B3FEF]/20"
                        >
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          Create Campaign
                        </button>
                        <a
                          href="#"
                          className="text-sm text-center text-[#FFFFFF]/60 hover:text-[#2A9BF6] transition-colors"
                        >
                          Learn how it works →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default CampaignsPage;
