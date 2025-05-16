export interface Campaign {
  id: string;
  name: string;
  status: "active" | "upcoming" | "completed";
  creator: string;
  logo: string;
  description: string;
  startDate: Date;
  endDate: Date;
  farcasterLink?: string;
  participants?: number;
  totalRewards?: string;
}

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "DeFi Revolution Token",
    status: "active",
    creator: "DeFi Innovators",
    logo: "#7B3FEF",
    description: "Revolutionizing decentralized finance with community-driven solutions and cross-chain compatibility.",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    farcasterLink: "https://warpcast.com/~/conversations/0x3fa630d49b240288f4301f2825eda1469dc9e3b9",
    participants: 150,
    totalRewards: "2.5 ETH",
  },
  {
    id: "2",
    name: "MetaVerse Creator Fund",
    status: "active",
    creator: "Virtual Worlds Collective",
    logo: "#2A9BF6",
    description: "Funding the next generation of content creators building in virtual worlds and the metaverse.",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    farcasterLink: "https://warpcast.com/~/conversations/0x...",
    participants: 200,
    totalRewards: "3.0 ETH",
  },
  {
    id: "3",
    name: "GameFi Pioneers",
    status: "upcoming",
    creator: "Play2Earn Alliance",
    logo: "#F8C62B",
    description: "Bridging gaming and finance to create sustainable play-to-earn ecosystems for gamers worldwide.",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    id: "4",
    name: "Climate Action Token",
    status: "completed",
    creator: "Green Blockchain Initiative",
    logo: "#24E8AD",
    description: "Using blockchain technology to fund and track environmental initiatives with complete transparency.",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    participants: 500,
    totalRewards: "10.0 ETH",
  },
  {
    id: "5",
    name: "Creator Economy Platform",
    status: "completed",
    creator: "Digital Creators Union",
    logo: "#FF5C6A",
    description: "Building tools that help digital creators monetize their content and engage with their supporters.",
    startDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000), // 55 days ago
    endDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
  },
  {
    id: "6",
    name: "DeFi Education Initiative",
    status: "active",
    creator: "Crypto Knowledge DAO",
    logo: "#7B3FEF",
    description: "Making decentralized finance accessible to everyone through high-quality educational content.",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
  },
]; 