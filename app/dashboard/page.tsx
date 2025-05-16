"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import ResponsiveHeader from "~~/components/Header";
import { Footer } from "~~/components/Footer";
import { mockCampaigns } from "../view-campaigns/mockCampaigns";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed';
  creator: string;
  logo: string;
  description: string;
  startDate: Date;   
  endDate: Date;
  farcasterLink?: string;
  participants?: number;
  totalRewards?: string;
}

const DashboardPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalParticipants: 0,
    totalRewards: "0 ETH"
  });

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    // Filter campaigns created by the current user
    const campaigns = mockCampaigns.filter(c => c.creator === address);
    setUserCampaigns(campaigns);

    // Calculate stats
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalParticipants = campaigns.reduce((sum, c) => sum + (c.participants || 0), 0);
    const totalRewards = campaigns.reduce((sum, c) => {
      const reward = parseFloat(c.totalRewards?.replace(' ETH', '') || '0');
      return sum + reward;
    }, 0).toFixed(1) + ' ETH';

    setStats({
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalParticipants,
      totalRewards
    });
  }, [address, isConnected]);

  const getStatusUI = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#24E8AD]/20 text-[#24E8AD]">
            Active
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F8C62B]/20 text-[#F8C62B]">
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FF5C6A]/20 text-[#FF5C6A]">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1D2A] text-white">
      <ResponsiveHeader 
        logo={{ text: "COIN CAST" }}
        navItems={[
          { id: "home", label: "Home", onClick: () => router.push("/") },
          { id: "dashboard", label: "Dashboard", onClick: () => router.push("/dashboard") },
          { id: "create", label: "Create Campaign", onClick: () => router.push("/create-campaign") },
          { id: "view-campaigns", label: "View Campaigns", onClick: () => router.push("/view-campaigns") },
        ]}
        activeSection="dashboard"
      />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-[#FFFFFF]/60">Manage your campaigns and track your performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#24262F] rounded-xl p-6 border border-[#FFFFFF]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#7B3FEF]/20 flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-[#7B3FEF]" />
                </div>
                <span className="text-2xl font-bold">{stats.totalCampaigns}</span>
              </div>
              <h3 className="text-[#FFFFFF]/60 text-sm">Total Campaigns</h3>
            </div>

            <div className="bg-[#24262F] rounded-xl p-6 border border-[#FFFFFF]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#24E8AD]/20 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-[#24E8AD]" />
                </div>
                <span className="text-2xl font-bold">{stats.activeCampaigns}</span>
              </div>
              <h3 className="text-[#FFFFFF]/60 text-sm">Active Campaigns</h3>
            </div>

            <div className="bg-[#24262F] rounded-xl p-6 border border-[#FFFFFF]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#2A9BF6]/20 flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-[#2A9BF6]" />
                </div>
                <span className="text-2xl font-bold">{stats.totalParticipants}</span>
              </div>
              <h3 className="text-[#FFFFFF]/60 text-sm">Total Participants</h3>
            </div>

            <div className="bg-[#24262F] rounded-xl p-6 border border-[#FFFFFF]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F8C62B]/20 flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-[#F8C62B]" />
                </div>
                <span className="text-2xl font-bold">{stats.totalRewards}</span>
              </div>
              <h3 className="text-[#FFFFFF]/60 text-sm">Total Rewards</h3>
            </div>
          </div>

          {/* Campaigns Section */}
          <div className="bg-[#24262F] rounded-xl border border-[#FFFFFF]/10 overflow-hidden">
            <div className="p-6 border-b border-[#FFFFFF]/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Campaigns</h2>
              <button
                onClick={() => router.push('/create-campaign')}
                className="px-4 py-2 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white rounded-lg transition-colors flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Campaign
              </button>
            </div>

            <div className="divide-y divide-[#FFFFFF]/10">
              {userCampaigns.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[#FFFFFF]/60 mb-4">You haven't created any campaigns yet</p>
                  <button
                    onClick={() => router.push('/create-campaign')}
                    className="px-6 py-3 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white rounded-lg transition-colors"
                  >
                    Create Your First Campaign
                  </button>
                </div>
              ) : (
                userCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-6 hover:bg-[#FFFFFF]/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-[#1A1D2A] flex items-center justify-center mr-4">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: campaign.logo }}></div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{campaign.name}</h3>
                          <p className="text-sm text-[#FFFFFF]/60">
                            {campaign.status === 'active' ? 'Ends ' + campaign.endDate.toLocaleDateString() :
                             campaign.status === 'upcoming' ? 'Starts ' + campaign.startDate.toLocaleDateString() :
                             'Ended ' + campaign.endDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusUI(campaign.status)}
                        <button
                          onClick={() => router.push(`/view-campaigns/${campaign.id}`)}
                          className="p-2 text-[#FFFFFF]/60 hover:text-white transition-colors"
                        >
                          <ArrowRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Connect Wallet Modal */}
      {!isConnected && (
        <div className="fixed inset-0 bg-[#1A1D2A]/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#24262F] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#FFFFFF]/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-[#FFFFFF]/60">
                Connect your wallet to view your dashboard and manage your campaigns
              </p>
            </div>
            <div className="flex justify-center">
              <RainbowKitCustomConnectButton text="Connect Wallet" />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage; 