"use client"
import { 
  ArrowRightIcon, 
  ChevronDownIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import ResponsiveHeader from "~~/components/Header";

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed';
  creator: string;
  logo: string;
  raisedAmount: number;
  targetAmount: number;
  participants: number;
  creatorEngagement: number;
  category: string;
  description: string;
  endDate: Date;
}

const CampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Simulate loading data from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // This would come from your API/database in a real implementation
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'DeFi Revolution Token',
      status: 'active',
      creator: 'DeFi Innovators',
      logo: '#7B3FEF', // This would be a URL in production
      raisedAmount: 125000,
      targetAmount: 200000,
      participants: 230,
      creatorEngagement: 87,
      category: 'defi',
      description: 'Revolutionizing decentralized finance with community-driven solutions and cross-chain compatibility.',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      id: '2',
      name: 'MetaVerse Creator Fund',
      status: 'active',
      creator: 'Virtual Worlds Collective',
      logo: '#2A9BF6',
      raisedAmount: 450000,
      targetAmount: 500000,
      participants: 560,
      creatorEngagement: 92,
      category: 'metaverse',
      description: 'Funding the next generation of content creators building in virtual worlds and the metaverse.',
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    },
    {
      id: '3',
      name: 'GameFi Pioneers',
      status: 'upcoming',
      creator: 'Play2Earn Alliance',
      logo: '#F8C62B',
      raisedAmount: 0,
      targetAmount: 350000,
      participants: 0,
      creatorEngagement: 0,
      category: 'gaming',
      description: 'Bridging gaming and finance to create sustainable play-to-earn ecosystems for gamers worldwide.',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
      id: '4',
      name: 'Climate Action Token',
      status: 'completed',
      creator: 'Green Blockchain Initiative',
      logo: '#24E8AD',
      raisedAmount: 780000,
      targetAmount: 750000,
      participants: 1240,
      creatorEngagement: 95,
      category: 'environmental',
      description: 'Using blockchain technology to fund and track environmental initiatives with complete transparency.',
      endDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
    },
    {
      id: '5',
      name: 'Creator Economy Platform',
      status: 'completed',
      creator: 'Digital Creators Union',
      logo: '#FF5C6A',
      raisedAmount: 320000,
      targetAmount: 300000,
      participants: 780,
      creatorEngagement: 89,
      category: 'content',
      description: 'Building tools that help digital creators monetize their content and engage with their supporters.',
      endDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
    },
    {
      id: '6',
      name: 'DeFi Education Initiative',
      status: 'active',
      creator: 'Crypto Knowledge DAO',
      logo: '#7B3FEF',
      raisedAmount: 85000,
      targetAmount: 150000,
      participants: 320,
      creatorEngagement: 78,
      category: 'education',
      description: 'Making decentralized finance accessible to everyone through high-quality educational content.',
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
    }
  ];

  // Filter campaigns based on active tab, search query, and category
  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    // Filter by active tab
    if (activeTab === 'active' && campaign.status === 'completed') return false;
    if (activeTab === 'completed' && (campaign.status === 'active' || campaign.status === 'upcoming')) return false;
    
    // Filter by search query
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !campaign.creator.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !campaign.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by category
    if (filterCategory !== 'all' && campaign.category !== filterCategory) return false;
    
    return true;
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a: Campaign, b: Campaign) => {
    switch (sortBy) {
      case 'newest':
        return b.endDate.getTime() - a.endDate.getTime();
      case 'oldest':
        return a.endDate.getTime() - b.endDate.getTime();
      case 'mostFunded':
        return b.raisedAmount - a.raisedAmount;
      case 'mostParticipants':
        return b.participants - a.participants;
      default:
        return 0;
    }
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTimeRemaining = (endDate: Date): string => {
    const total = endDate.getTime() - new Date().getTime();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    
    if (total < 0) {
      return 'Ended';
    }
    
    return `${days}d ${hours}h`;
  };

  // Generate dynamic status UI based on campaign status
  const getStatusUI = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#24E8AD]/20 border border-[#24E8AD]/30 rounded-full">
            <FireIcon className="h-3.5 w-3.5 text-[#24E8AD]" />
            <span className="text-xs font-medium text-[#24E8AD]">ACTIVE</span>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#F8C62B]/20 border border-[#F8C62B]/30 rounded-full">
            <ClockIcon className="h-3.5 w-3.5 text-[#F8C62B]" />
            <span className="text-xs font-medium text-[#F8C62B]">UPCOMING</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#7B3FEF]/20 border border-[#7B3FEF]/30 rounded-full">
            <CheckCircleIcon className="h-3.5 w-3.5 text-[#7B3FEF]" />
            <span className="text-xs font-medium text-[#7B3FEF]">COMPLETED</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1D2A] text-white">
      <ResponsiveHeader 
        navItems={[
          { id: "home", label: "Home", onClick: () => window.location.href = "/" },
          { id: "create", label: "Create Campaign", onClick: () => window.location.href = "/create-campaign" },
          { id: "active", label: "Active Campaigns", onClick: () => setActiveTab("active") },
          { id: "upcoming", label: "Upcoming", onClick: () => setActiveTab("upcoming") },
          { id: "completed", label: "Completed", onClick: () => setActiveTab("completed") }
        ]}
        activeSection={activeTab}
        logo={{
          text: "COIN CAST",
          icon: (
            <div className="w-10 h-10 rounded-full bg-[#7B3FEF] flex items-center justify-center">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#F8C62B] rounded-full"></div>
              </div>
            </div>
          )
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
                    animation: `pulse 3s infinite ${Math.random() * 2}s`
                  }} 
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <div 
                  key={`connection-${i}`}
                  className="absolute bg-[#2A9BF6]"
                  style={{ 
                    height: '1px',
                    width: `${20 + Math.random() * 60}px`,
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    opacity: 0.2
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
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#7B3FEF' : '#2A9BF6'}, transparent)`,
                  opacity: 0.05,
                  transform: `skewY(${1 - i/2}deg)`
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
                Find and support token campaigns that align with your interests.
                Connect with creators and share in their success.
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-lg border border-[#FFFFFF]/10 bg-[#24262F]/80 backdrop-blur-sm p-1">
                <button
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'active'
                      ? 'bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] text-white shadow-lg'
                      : 'text-[#FFFFFF]/70 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('active')}
                >
                  Active
                </button>
                <button
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'upcoming'
                      ? 'bg-gradient-to-r from-[#F8C62B] to-[#FF5C6A] text-white shadow-lg'
                      : 'text-[#FFFFFF]/70 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'completed'
                      ? 'bg-gradient-to-r from-[#24E8AD] to-[#2A9BF6] text-white shadow-lg'
                      : 'text-[#FFFFFF]/70 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </button>
              </div>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1D2A] border border-[#FFFFFF]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3FEF] text-white placeholder-[#FFFFFF]/40 transition-all"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-3 bg-[#1A1D2A] border border-[#FFFFFF]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3FEF] text-white transition-all"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="mostFunded">Most Funded</option>
                      <option value="mostParticipants">Most Participants</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFFF]/40 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-3 bg-[#1A1D2A] border border-[#FFFFFF]/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3FEF] text-white transition-all"
                    >
                      <option value="all">All Categories</option>
                      <option value="defi">DeFi</option>
                      <option value="metaverse">Metaverse</option>
                      <option value="gaming">Gaming</option>
                      <option value="environmental">Environmental</option>
                      <option value="content">Content</option>
                      <option value="education">Education</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFFF]/40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-[#24262F] rounded-xl overflow-hidden border border-[#FFFFFF]/10 animate-pulse">
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
            ) : (
              <>
                {/* No Results State */}
                {sortedCampaigns.length === 0 ? (
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
                          setSearchQuery('');
                          setFilterCategory('all');
                          setSortBy('newest');
                        }}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-[#7B3FEF]/20"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Campaigns Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="group relative bg-[#24262F] rounded-xl overflow-hidden border border-[#FFFFFF]/10 hover:border-[#7B3FEF]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#7B3FEF]/10"
                      >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#7B3FEF]/10 blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#2A9BF6]/10 blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                        
                        <div className="p-6 relative z-10">
                          <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-[#1A1D2A] p-1">
                                <div 
                                  className="w-full h-full rounded-full flex items-center justify-center text-[#1A1D2A] font-bold"
                                  style={{ backgroundColor: campaign.logo }}
                                >
                                  {campaign.name.charAt(0)}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white leading-tight">{campaign.name}</h3>
                                <div className="flex items-center mt-1">
                                  <span className="text-sm text-[#FFFFFF]/60">by {campaign.creator}</span>
                                </div>
                              </div>
                            </div>
                            {getStatusUI(campaign.status)}
                          </div>

                          <p className="text-[#FFFFFF]/80 mb-5 line-clamp-2 h-12">{campaign.description}</p>

                          <div className="space-y-5">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-[#FFFFFF]/60">Progress</span>
                                <span className="text-[#FFFFFF]/80">
                                  {formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.targetAmount)}
                                </span>
                              </div>
                              <div className="w-full h-2 bg-[#1A1D2A] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    campaign.status === 'active' 
                                      ? 'bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6]' 
                                      : campaign.status === 'upcoming'
                                        ? 'bg-gradient-to-r from-[#F8C62B] to-[#FF5C6A]'
                                        : 'bg-gradient-to-r from-[#24E8AD] to-[#2A9BF6]'
                                  }`}
                                  style={{ width: `${Math.min(100, (campaign.raisedAmount / campaign.targetAmount) * 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-3 bg-[#1A1D2A] rounded-lg text-center">
                                <div className="text-lg font-semibold text-[#F8C62B]">{campaign.participants.toLocaleString()}</div>
                                <div className="text-xs text-[#FFFFFF]/60">Participants</div>
                              </div>
                              <div className="p-3 bg-[#1A1D2A] rounded-lg text-center">
                                <div className="text-lg font-semibold text-[#2A9BF6]">{campaign.creatorEngagement}%</div>
                                <div className="text-xs text-[#FFFFFF]/60">Engagement</div>
                              </div>
                              <div className="p-3 bg-[#1A1D2A] rounded-lg text-center">
                                <div className="text-lg font-semibold text-[#24E8AD]">{getTimeRemaining(campaign.endDate)}</div>
                                <div className="text-xs text-[#FFFFFF]/60">Remaining</div>
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] hover:opacity-90 text-white font-medium rounded-lg transition-all flex items-center justify-center">
                                {campaign.status === 'completed' ? (
                                  <>View Details</>
                                ) : campaign.status === 'upcoming' ? (
                                  <>Get Notified</>
                                ) : (
                                  <>Participate Now</>
                                )}
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                              </button>
                              <button className="p-3 border border-[#FFFFFF]/10 hover:border-[#FFFFFF]/20 rounded-lg transition-all bg-[#1A1D2A]">
                                <StarIcon className="h-5 w-5 text-[#F8C62B]/70 hover:text-[#F8C62B]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create Campaign CTA */}
                {activeTab !== 'completed' && (
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
                              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#7B3FEF' : '#2A9BF6'}, transparent)`,
                              opacity: 0.05,
                              transform: `skewY(${1 - i/2}deg)`
                            }}
                          />
                        ))}
                      </div>

                      <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                          <div className="mb-6 md:mb-0 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Launch Your Token Campaign?</h2>
                            <p className="text-[#FFFFFF]/80 max-w-xl">
                              Create a token campaign to connect with content creators and build a thriving community around your project. Share your success with creators who promote your vision.
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <button className="px-6 py-3 bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] hover:opacity-90 text-white font-medium rounded-lg transition-all transform hover:scale-105 flex items-center justify-center shadow-lg shadow-[#7B3FEF]/20">
                              <SparklesIcon className="h-5 w-5 mr-2" />
                              Create Campaign
                            </button>
                            <a href="#" className="text-sm text-center text-[#FFFFFF]/60 hover:text-[#2A9BF6] transition-colors">
                              Learn how it works →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default CampaignsPage;