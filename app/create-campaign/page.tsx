"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  ExternalLink, 
  Tag, 
  X, 
  CheckCircle, 
  AlignJustify, 
  Sparkles
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatEther } from "viem";
import { Address } from "viem";
import { base } from "viem/chains";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";
import { ConnectWalletSection } from "~~/components/ConnectWalletSection";
import { Footer } from "~~/components/Footer";
import ResponsiveHeader from "~~/components/Header";
import { BACKEND_URL } from "~~/constants";
import { ClankerTokenDetails, useClankerVerification } from "~~/hooks/useClankerVerification";
import { useSplit } from "~~/hooks/useSplit";
import { CoinDetails, useTokenVerification } from "~~/hooks/useTokenVerification";
import { useUpdateClankerPayoutRecipient } from "~~/hooks/useUpdateClankerPayoutRecipient";
import { useUpdatePayoutRecipient } from "~~/hooks/useUpdatePayoutRecipient";
import { useZoraBalances } from "~~/hooks/useZoraBalances";
import { useZoraProfile } from "~~/hooks/useZoraProfile";
import { useZoraRewards } from "~~/hooks/useZoraRewards";
import { WalletConnectionOverlay } from "~~/components/WalletConnectionOverlay";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

// Token types
type TokenType = "zora" | "clanker";

// Steps for campaign creation
type Step = "type" | "link" | "details";

const CampaignPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<Step>("type");
  const [tokenType, setTokenType] = useState<TokenType | null>(null);
  const [tokenLink, setTokenLink] = useState("");
  const [clankerTokenAddress, setClankerTokenAddress] = useState<Address | null>(null);
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [rewardPercentage, setRewardPercentage] = useState(25);
  const [description, setDescription] = useState("");
  const [campaignDuration, setCampaignDuration] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { address, isConnected: walletConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { fetchProfile } = useZoraProfile();
  const { fetchAllBalances } = useZoraBalances();
  const { fetchRewards } = useZoraRewards();
  const { createProtocolSplit, isLoading: isSplitLoading, error: splitError } = useSplit();
  const { updatePayoutRecipient, isLoading: isUpdatingPayout, error: payoutError } = useUpdatePayoutRecipient();
  const {
    updatePayoutRecipient: updateClankerPayoutRecipient,
    isLoading: isUpdatingClankerPayout,
    error: clankerPayoutError,
  } = useUpdateClankerPayoutRecipient();
  const chainId = useChainId();
  const { verifyToken, isVerifying: isVerifyingToken, error: verificationError, coinDetails } = useTokenVerification();
  const {
    verifyToken: verifyClankerToken,
    isVerifying: isVerifyingClanker,
    error: clankerVerificationError,
    tokenDetails: clankerTokenDetails,
  } = useClankerVerification();

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["zoraProfile", address],
    queryFn: () => fetchProfile(address),
    enabled: !!isConnected && !!address,
    staleTime: Infinity,
  });

  // Fetch user balances
  const { data: balances } = useQuery({
    queryKey: ["zoraBalances", address],
    queryFn: () => fetchAllBalances(address),
    enabled: !!isConnected && !!address,
    staleTime: Infinity,
  });

  // Fetch user rewards
  const { data: rewards } = useQuery({
    queryKey: ["zoraRewards", address],
    queryFn: () => fetchRewards(),
    enabled: !!isConnected && !!address,
    staleTime: Infinity,
  });

  // Calculate unclaimed rewards and convert to ETH
  const unclaimedRewards = useMemo(() => {
    if (!rewards?.protocolRewards) return BigInt(0);

    if (typeof rewards.protocolRewards === "bigint") {
      return rewards.protocolRewards;
    }

    if (typeof rewards.protocolRewards === "object" && rewards.protocolRewards.wei) {
      return BigInt(rewards.protocolRewards.wei);
    }

    if (typeof rewards.protocolRewards === "string") {
      return BigInt(rewards.protocolRewards);
    }

    return BigInt(0);
  }, [rewards]);

  const availableEth = useMemo(() => Number(formatEther(unclaimedRewards)), [unclaimedRewards]);

  // Add useEffect to calculate duration when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCampaignDuration(diffDays);
    } else {
      setCampaignDuration(null);
    }
  }, [startDate, endDate]);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function extractTokenAddress(link: string): string | null {
    console.log('Extracting token address from:', link);

    // Check if it's a direct address
    if (link.startsWith('0x')) {
      console.log('Direct address detected:', link);
      return link;
    }

    // Try to extract from Clanker link
    const clankerPatterns = [
      /clanker\.world\/clanker\/(0x[a-fA-F0-9]{40})/,
      /clanker\.world\/clanker\/([a-fA-F0-9]{40})/,
      /clanker\/(0x[a-fA-F0-9]{40})/,
      /clanker\/([a-fA-F0-9]{40})/
    ];

    for (const pattern of clankerPatterns) {
      const match = link.match(pattern);
      if (match) {
        const address = match[1];
        console.log('Clanker address extracted:', address);
        return address.startsWith('0x') ? address : `0x${address}`;
      }
    }

    // Try to extract from Zora link
    const zoraPatterns = [
      /zora\.co\/coin\/base:(0x[a-fA-F0-9]{40})/,
      /zora\.co\/coin\/(0x[a-fA-F0-9]{40})/,
      /zora\/(0x[a-fA-F0-9]{40})/,
      /zora\/([a-fA-F0-9]{40})/
    ];

    for (const pattern of zoraPatterns) {
      const match = link.match(pattern);
      if (match) {
        const address = match[1];
        console.log('Zora address extracted:', address);
        return address.startsWith('0x') ? address : `0x${address}`;
      }
    }

    console.log('No valid address found in input');
    return null;
  }

  const handleSelectTokenType = (type: TokenType) => {
    setTokenType(type);
    setCurrentStep("link");
  };

  const handleVerifyLink = async () => {
    if (!tokenLink && !clankerTokenAddress) {
      setErrorMessage("Please enter a token link or address");
      setShowErrorModal(true);
      return;
    }

    if (!address) {
      setErrorMessage("Wallet not connected");
      setShowErrorModal(true);
      return;
    }

    if (tokenType === "zora") {
      const tokenAddress = extractTokenAddress(tokenLink);
      if (!tokenAddress) {
        setErrorMessage("Invalid Zora link or address format");
        setShowErrorModal(true);
        return;
      }

      const formattedTokenAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;
      const isValid = await verifyToken(formattedTokenAddress, address);

      if (isValid) {
        setCurrentStep("details");
      } else if (verificationError) {
        setErrorMessage(verificationError.message);
        setShowErrorModal(true);
      }
    } else {
      // Clanker verification
      if (!clankerTokenAddress) {
        setErrorMessage("Please enter a Clanker token address");
        setShowErrorModal(true);
        return;
      }

      console.log('Starting Clanker verification process:', {
        input: clankerTokenAddress,
        tokenType,
        userAddress: address
      });

      // Extract token address from link or use direct address
      const tokenAddress = extractTokenAddress(clankerTokenAddress);
      console.log('Token address extraction result:', {
        originalInput: clankerTokenAddress,
        extractedAddress: tokenAddress,
        isValid: !!tokenAddress
      });

      if (!tokenAddress) {
        setErrorMessage("Invalid Clanker link or address format");
        setShowErrorModal(true);
        return;
      }

      // Format the token address
      const formattedTokenAddress = tokenAddress.startsWith("0x") 
        ? tokenAddress 
        : `0x${tokenAddress}`;

      console.log('Verifying Clanker token:', {
        originalAddress: clankerTokenAddress,
        extractedAddress: tokenAddress,
        formattedAddress: formattedTokenAddress,
        userAddress: address,
        verificationStep: 'Starting verification'
      });

      const isValid = await verifyClankerToken(formattedTokenAddress, address);
      console.log('Verification result:', {
        isValid,
        error: clankerVerificationError,
        tokenDetails: clankerTokenDetails
      });

      if (isValid) {
        setCurrentStep("details");
      } else if (clankerVerificationError) {
        setErrorMessage(clankerVerificationError.message);
        setShowErrorModal(true);
      }
    }
  };

  const createSplitContract = async (): Promise<Address> => {
    if (tokenType === "zora") {
      const tokenAddress = extractTokenAddress(tokenLink);
      if (!tokenAddress) {
        throw new Error("Invalid Zora link: No token address found");
      }

      const formattedAddress = tokenAddress.startsWith("0x") ? tokenAddress : `0x${tokenAddress}`;

      // Create split contract
      const splitAddress = await createProtocolSplit(rewardPercentage, formattedAddress as Address);
      if (!splitAddress) {
        throw new Error("Failed to create split contract");
      }

      // Update payout recipient to split address
      const success = await updatePayoutRecipient(formattedAddress as Address, splitAddress);
      if (!success) {
        throw new Error(`Failed to update Zora payout recipient: ${payoutError}`);
      }

      return splitAddress;
    } else {
      // Clanker flow
      if (!clankerTokenDetails) {
        throw new Error("Clanker token details not available");
      }

      // Create split contract using the LP Locker contract address
      const splitAddress = await createProtocolSplit(rewardPercentage, clankerTokenDetails.lpLockerAddress);
      if (!splitAddress) {
        throw new Error("Failed to create split contract");
      }

      // Update Clanker payout recipient to split address
      const success = await updateClankerPayoutRecipient(
        clankerTokenDetails.id,
        clankerTokenDetails.lpLockerAddress,
        splitAddress,
      );

      if (!success) {
        throw new Error(`Failed to update Clanker payout recipient: ${clankerPayoutError}`);
      }

      return splitAddress;
    }
  };

  const handleCreateCampaign = async () => {
    if (!validateInputs()) {
      setShowErrorModal(true);
      return;
    }

    setIsCreating(true);
    try {
      // Create split contract
      const splitAddress = await createSplitContract();

      // Store campaign details
      const campaignDetails = {
        tokenType,
        tokenLink: tokenType === "zora" ? tokenLink : undefined,
        clankerTokenAddress: tokenType === "clanker" ? clankerTokenAddress : undefined,
        rewardPercentage,
        startDate,
        endDate,
        keywords,
        splitAddress,
        budgetPercentage: rewardPercentage,
      };

      // Store in local storage
      localStorage.setItem('campaignDetails', JSON.stringify(campaignDetails));

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create campaign');
      setShowErrorModal(true);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  const validateInputs = () => {
    if (!tokenType) {
      setErrorMessage("Please select a token type");
      return false;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates");
      return false;
    }

    if (startDate >= endDate) {
      setErrorMessage("End date must be after start date");
      return false;
    }

    if (rewardPercentage <= 0 || rewardPercentage > 100 || !Number.isInteger(rewardPercentage)) {
      setErrorMessage("Reward percentage must be a whole number between 1 and 100");
      return false;
    }

    if (keywords.length === 0) {
      setErrorMessage("Please add at least one keyword");
      return false;
    }

    return true;
  };

  // Dynamic background element component
  const DynamicBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Node Network Animation */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={`node-${i}`} 
          className="absolute w-2 h-2 rounded-full bg-[#7B3FEF]" 
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`, 
            opacity: 0.2 + (Math.random() * 0.3),
            animation: `pulse ${3 + Math.random() * 2}s infinite ${Math.random() * 2}s` 
          }} 
        />
      ))}
      
      {/* Connection Lines */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={`line-${i}`} 
          className="absolute bg-[#2A9BF6]" 
          style={{ 
            height: '1px', 
            width: `${30 + Math.random() * 50}px`, 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`, 
            transform: `rotate(${Math.random() * 360}deg)`, 
            opacity: 0.1 
          }} 
        />
      ))}
      
      {/* Wave Forms */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={`wave-${i}`}
          className="absolute w-full h-24" 
          style={{ 
            top: `${20 + i * 25}%`, 
            background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#7B3FEF' : '#2A9BF6'}, transparent)`, 
            opacity: 0.03, 
            transform: `skewY(${2 - i}deg)` 
          }} 
        />
      ))}
    </div>
  );

  // Step Indicator with numbers and animation
  const renderStepIndicator = () => (
    <div className="flex flex-col md:flex-row items-center justify-center mb-8 relative z-10">
      {/* Step 1 */}
      <div className="flex flex-col items-center mb-4 md:mb-0">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
            currentStep === "type" 
              ? "border-[#7B3FEF] bg-[#7B3FEF]/20 text-[#7B3FEF]" 
              : currentStep === "link" || currentStep === "details" 
                ? "border-[#24E8AD] bg-[#24E8AD]/10 text-[#24E8AD]" 
                : "border-[#FFFFFF]/30 bg-[#FFFFFF]/5 text-[#FFFFFF]/50"
          }`}
        >
          {currentStep === "link" || currentStep === "details" ? <CheckCircle className="h-5 w-5" /> : "1"}
        </div>
        <span className={`mt-2 text-sm md:text-base ${
          currentStep === "type" ? "text-white font-medium" : "text-[#FFFFFF]/60"
        }`}>Select Token</span>
      </div>
      
      {/* Connector Line */}
      <div className="h-8 w-0.5 bg-[#FFFFFF]/10 md:h-0.5 md:w-12 mx-4 my-1 md:my-0"></div>
      
      {/* Step 2 */}
      <div className="flex flex-col items-center mb-4 md:mb-0">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
            currentStep === "link" 
              ? "border-[#7B3FEF] bg-[#7B3FEF]/20 text-[#7B3FEF]" 
              : currentStep === "details" 
                ? "border-[#24E8AD] bg-[#24E8AD]/10 text-[#24E8AD]" 
                : "border-[#FFFFFF]/30 bg-[#FFFFFF]/5 text-[#FFFFFF]/50"
          }`}
        >
          {currentStep === "details" ? <CheckCircle className="h-5 w-5" /> : "2"}
        </div>
        <span className={`mt-2 text-sm md:text-base ${
          currentStep === "link" ? "text-white font-medium" : "text-[#FFFFFF]/60"
        }`}>Verify Token</span>
      </div>
      
      {/* Connector Line */}
      <div className="h-8 w-0.5 bg-[#FFFFFF]/10 md:h-0.5 md:w-12 mx-4 my-1 md:my-0"></div>
      
      {/* Step 3 */}
      <div className="flex flex-col items-center">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
            currentStep === "details" 
              ? "border-[#7B3FEF] bg-[#7B3FEF]/20 text-[#7B3FEF]" 
              : "border-[#FFFFFF]/30 bg-[#FFFFFF]/5 text-[#FFFFFF]/50"
          }`}
        >
          3
        </div>
        <span className={`mt-2 text-sm md:text-base ${
          currentStep === "details" ? "text-white font-medium" : "text-[#FFFFFF]/60"
        }`}>Campaign Details</span>
      </div>
    </div>
  );

  // Enhanced Token Type Selection with visual cues
  const renderTypeStep = () => (
    <div className="space-y-8 relative z-10">
      <div className="mb-6 text-center max-w-xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Choose Your Token Type</h2>
        <p className="text-[#FFFFFF]/70">
          Select the type of token you want to create a campaign for. This will determine how your
          campaign is configured and which platform's features you'll use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zora Option */}
        <div
          onClick={() => handleSelectTokenType("zora")}
          className="relative group border border-[#FFFFFF]/10 p-6 md:p-8 rounded-lg cursor-pointer transition-all bg-[#24262F] hover:shadow-xl hover:shadow-[#2A9BF6]/10 hover:border-[#2A9BF6] overflow-hidden"
        >
          {/* Gradient Highlight */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#2A9BF6]/0 via-[#2A9BF6]/20 to-[#2A9BF6]/0 opacity-0 group-hover:opacity-100 rounded-lg blur transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#2A9BF6]/20 rounded-full flex items-center justify-center border-2 border-[#2A9BF6]/40">
                  <img src="https://zora.co/favicon.ico" alt="Zora" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white">Zora</h3>
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-[#FFFFFF]/20 flex items-center justify-center group-hover:border-[#2A9BF6] group-hover:bg-[#2A9BF6]/10 transition-all">
                <ArrowRight className="h-4 w-4 text-[#FFFFFF]/50 group-hover:text-[#2A9BF6]" />
              </div>
            </div>
            
            <p className="text-[#FFFFFF]/70 mb-5">
              Create a campaign for your Zora token to connect with content creators and build community engagement.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#2A9BF6]/20 flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-3 w-3 text-[#2A9BF6]" />
                </div>
                <span className="text-sm text-[#FFFFFF]/80">Connect with Zora token holders</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#2A9BF6]/20 flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-3 w-3 text-[#2A9BF6]" />
                </div>
                <span className="text-sm text-[#FFFFFF]/80">Incentivize content creation on Zora</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#2A9BF6]/20 flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-3 w-3 text-[#2A9BF6]" />
                </div>
                <span className="text-sm text-[#FFFFFF]/80">Distribute rewards automatically</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clanker Option */}
        <div
          onClick={() => handleSelectTokenType("clanker")}
          className="relative group border border-[#FFFFFF]/10 p-6 md:p-8 rounded-lg cursor-pointer transition-all bg-[#24262F] hover:shadow-xl hover:shadow-[#7B3FEF]/10 hover:border-[#7B3FEF] overflow-hidden"
        >
          {/* Gradient Highlight */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FEF]/0 via-[#7B3FEF]/20 to-[#7B3FEF]/0 opacity-0 group-hover:opacity-100 rounded-lg blur transition-all"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#7B3FEF]/20 rounded-full flex items-center justify-center border-2 border-[#7B3FEF]/40">
                  <img
                    src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/d9c4e268-7c3d-4469-0552-4c5f29593100/original"
                    alt="Clanker"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">Clanker</h3>
              </div>
              <div className="h-8 w-8 rounded-full border-2 border-[#FFFFFF]/20 flex items-center justify-center group-hover:border-[#7B3FEF] group-hover:bg-[#7B3FEF]/10 transition-all">
                <ArrowRight className="h-4 w-4 text-[#FFFFFF]/50 group-hover:text-[#7B3FEF]" />
              </div>
            </div>
            
            <p className="text-[#FFFFFF]/70 mb-5">
              Create a campaign for your Clanker token to share success with micro-creators who promote your project.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#7B3FEF]/20 flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-3 w-3 text-[#7B3FEF]" />
                </div>
                <span className="text-sm text-[#FFFFFF]/80">Share liquidity provider fees</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#7B3FEF]/20 flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-3 w-3 text-[#7B3FEF]" />
                </div>
                <span className="text-sm text-[#FFFFFF]/80">Reward community promoters</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-[#7B3FEF]/20 flex items-center justify-center mt-0.5">
                  <CheckCircle className="h-3 w-3 text-[#7B3FEF]" />
                </div>
                <span className="text-sm text-[#FFFFFF]/80">Ensure long-term token sustainability</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced token link/verification UI with clearer visual feedback
  const renderLinkStep = () => {
    return (
      <div className="space-y-6 relative z-10">
        <div className="mb-6 text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
            {tokenType === "zora" ? "Connect Your Zora Token" : "Connect Your Clanker Token"}
          </h2>
          <p className="text-[#FFFFFF]/70">
            {tokenType === "zora" 
              ? "Enter your Zora token link or address to connect your campaign. This will allow us to verify ownership and setup reward distribution."
              : "Enter your Clanker token link or address to connect your campaign. We'll verify ownership and setup LP fee distribution."}
          </p>
        </div>

        <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10 shadow-lg">
          <div className="mb-6">
            <label className="block text-white mb-2 font-medium">
              {tokenType === "zora" ? "Zora Token Link/Address" : "Clanker Token Link/Address"}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-[#7B3FEF]">
                {tokenType === "zora" ? (
                  <ExternalLink className="h-5 w-5" />
                ) : (
                  <AlignJustify className="h-5 w-5" />
                )}
              </div>
              <input
                type="text"
                className="w-full border border-[#FFFFFF]/10 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#7B3FEF] bg-[#1A1D2A] text-white"
                placeholder={tokenType === "zora" 
                  ? "https://zora.co/collect/0x... or 0x..."
                  : "https://clanker.world/clanker/0x... or 0x..."}
                value={tokenType === "zora" ? tokenLink : clankerTokenAddress}
                onChange={(e) => {
                  if (tokenType === "zora") {
                    setTokenLink(e.target.value);
                  } else {
                    setClankerTokenAddress(e.target.value as Address);
                  }
                }}
              />
            </div>
            <p className="text-xs text-[#FFFFFF]/50 mt-2">
              {tokenType === "zora"
                ? "Enter your Zora token URL or address (e.g., https://zora.co/collect/0x... or 0x...)"
                : "Enter your Clanker token URL or address (e.g., https://clanker.world/clanker/0x... or 0x...)"}
            </p>
          </div>

          {/* Token Preview - Only shown when token details are available */}
          {coinDetails && (
            <div className="bg-[#1A1D2A] rounded-lg overflow-hidden border border-[#FFFFFF]/10 transition-all animate-fadeIn">
              <div className={`h-1.5 ${tokenType === "zora" 
                ? "bg-gradient-to-r from-[#2A9BF6] to-[#24E8AD]" 
                : "bg-gradient-to-r from-[#7B3FEF] to-[#F8C62B]"}`}>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${tokenType === "zora" 
                    ? "bg-[#2A9BF6]/20 border-[#2A9BF6]/30" 
                    : "bg-[#7B3FEF]/20 border-[#7B3FEF]/30"} flex items-center justify-center mr-3 border`}>
                    <span className={`font-bold ${tokenType === "zora" ? "text-[#2A9BF6]" : "text-[#7B3FEF]"}`}>
                      {tokenType === "zora" ? "Z" : "C"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{coinDetails.name}</h3>
                    <p className="text-[#FFFFFF]/70 text-sm">{coinDetails.symbol}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#FFFFFF]/5 rounded-lg p-3">
                    <p className="text-xs text-[#FFFFFF]/50 mb-1">Token Address</p>
                    <p className="text-white font-medium text-sm break-all">{coinDetails.address}</p>
                  </div>
                  <div className="bg-[#FFFFFF]/5 rounded-lg p-3">
                    <p className="text-xs text-[#FFFFFF]/50 mb-1">
                      {tokenType === "zora" ? "Market Cap" : "LP Locker"}
                    </p>
                    <p className="text-white font-medium text-sm break-all">
                      {tokenType === "zora" ? coinDetails.marketCap : (coinDetails as any).lpLockerAddress || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <a
                    href={`https://basescan.org/token/${coinDetails.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm hover:text-[#24E8AD] transition-colors flex items-center ${
                      tokenType === "zora" ? "text-[#2A9BF6]" : "text-[#7B3FEF]"
                    }`}
                  >
                    View Token on BaseScan
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep("type")}
            className="px-5 py-2.5 border border-[#FFFFFF]/10 rounded-lg text-white hover:bg-[#FFFFFF]/5 transition-colors font-medium flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <button
            onClick={handleVerifyLink}
            disabled={isVerifyingLink || (!tokenLink && !clankerTokenAddress)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all ${
              isVerifyingLink || (!tokenLink && !clankerTokenAddress)
                ? "bg-[#7B3FEF]/50 text-white/70 cursor-not-allowed"
                : "bg-[#7B3FEF] text-white hover:bg-[#6A35D0] hover:shadow-lg hover:shadow-[#7B3FEF]/20"
            }`}
          >
            {isVerifyingLink ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify Token"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Enhanced campaign details step with a more polished, visually informative UI
  const renderDetailsStep = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-medium mb-3 text-white">Campaign Duration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#FFFFFF]/80">Start Date</label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded-lg bg-[#1A1D2A] border border-[#FFFFFF]/10 text-white focus:border-[#7B3FEF] focus:ring-1 focus:ring-[#7B3FEF] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#FFFFFF]/80">End Date</label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              min={startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded-lg bg-[#1A1D2A] border border-[#FFFFFF]/10 text-white focus:border-[#7B3FEF] focus:ring-1 focus:ring-[#7B3FEF] outline-none transition-colors"
            />
          </div>
        </div>
        {campaignDuration !== null && (
          <div className="mt-4 bg-[#24262F] rounded-lg p-4 border border-[#FFFFFF]/10">
            <div className="flex items-center justify-between">
              <span className="text-[#FFFFFF]/80">Campaign Duration</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-[#7B3FEF]">{campaignDuration}</span>
                <span className="text-[#FFFFFF]/60">days</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-[#FFFFFF]/60">
              {campaignDuration === 1 
                ? "Your campaign will run for 1 day"
                : `Your campaign will run for ${campaignDuration} days`}
            </div>
          </div>
        )}
      </div>
  
      <div>
        <h3 className="text-xl font-medium mb-3 text-white">Campaign Description</h3>
        <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
          <textarea
            placeholder="Describe your campaign and its goals to attract content creators (optional)"
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-[#1A1D2A] border border-[#FFFFFF]/10 text-white placeholder-[#FFFFFF]/40 focus:border-[#7B3FEF] focus:ring-1 focus:ring-[#7B3FEF] outline-none resize-y transition-colors"
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-[#FFFFFF]/50">{description?.length || 0}/500 characters</span>
          </div>
        </div>
      </div>
  
      <div>
        <h3 className="text-xl font-medium mb-3 text-white">Reward Allocation</h3>
        <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-3 text-[#FFFFFF]/80">
              Percentage of LP Fees to Allocate
            </label>
            <div className="space-y-6">
              {(() => {
                const percentages = [25, 50, 75];
  
                return (
                  <>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          {percentages.map(percent => (
                            <button
                              key={percent}
                              onClick={() => setRewardPercentage(percent)}
                              className="px-3 py-1 text-sm bg-[#1A1D2A] hover:bg-[#2A9BF6]/20 rounded-lg text-white border border-[#FFFFFF]/10 hover:border-[#2A9BF6]/50 transition-colors"
                            >
                              {percent}%
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setRewardPercentage(100)}
                          className="px-3 py-1 text-sm bg-[#F8C62B]/20 hover:bg-[#F8C62B]/30 text-[#F8C62B] rounded-lg transition-colors border border-[#F8C62B]/30"
                        >
                          MAX
                        </button>
                      </div>
                      <div className="relative pt-6 pb-2">
                        <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-[#FFFFFF]/50">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          step="1"
                          value={rewardPercentage}
                          onChange={e => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1 && value <= 100) {
                              setRewardPercentage(value);
                            }
                          }}
                          className="w-full h-3 bg-[#1A1D2A] rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, #7B3FEF ${rewardPercentage}%, #1A1D2A ${rewardPercentage}%)`
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#FFFFFF]/70">Selected Percentage</span>
                      <span className="font-semibold text-[#7B3FEF]">
                        {rewardPercentage}%
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
  
      <div>
        <h3 className="text-xl font-medium mb-3 text-white">Campaign Keywords <span className="text-sm font-normal text-[#FFFFFF]/50">(optional)</span></h3>
        <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
          <div className="flex flex-wrap gap-2 mb-4 min-h-[36px]">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#7B3FEF]/20 to-[#2A9BF6]/20 text-white border border-[#7B3FEF]/30 text-sm"
              >
                {keyword}
                <button
                  onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                  className="ml-2 text-[#FFFFFF]/70 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a keyword (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  const value = input.value.trim();
                  if (value && !keywords.includes(value)) {
                    setKeywords([...keywords, value]);
                    input.value = '';
                  }
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-[#1A1D2A] border border-[#FFFFFF]/10 text-white placeholder-[#FFFFFF]/40 focus:border-[#7B3FEF] focus:ring-1 focus:ring-[#7B3FEF] outline-none transition-colors"
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Add a keyword (press Enter)"]') as HTMLInputElement;
                const value = input.value.trim();
                if (value && !keywords.includes(value)) {
                  setKeywords([...keywords, value]);
                  input.value = '';
                }
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] hover:opacity-90 text-white font-medium transition-all"
            >
              Add
            </button>
          </div>
          <p className="mt-3 text-xs text-[#FFFFFF]/50">Add keywords that represent your campaign's focus to help creators find it. Maximum 5 keywords.</p>
        </div>
      </div>
  
      <div className="flex justify-end space-x-4 mt-10">
        <button
          onClick={() => setCurrentStep("link")}
          className="px-6 py-3 rounded-lg bg-[#FFFFFF]/5 hover:bg-[#FFFFFF]/10 text-white font-medium border border-[#FFFFFF]/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleCreateCampaign}
          disabled={isCreating || !startDate || !endDate}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] hover:opacity-90 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isCreating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Campaign...
            </span>
          ) : (
            "Create Campaign"
          )}
        </button>
      </div>
  
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #F8C62B;
          cursor: pointer;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #F8C62B;
          cursor: pointer;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );

  // Navigation items for header
  const navItems = [
    { id: "home", label: "Home", onClick: () => router.push('/') },
    { id: "create", label: "Create Campaign", onClick: () => router.push('/create-campaign') },
    { id: "bounties", label: "Bounties", onClick: () => router.push('/bounties') }
  ];

  const logo = {
    text: "COIN CAST",
    icon: (
      <div className="w-10 h-10 rounded-full bg-[#7B3FEF] flex items-center justify-center">
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#F8C62B] rounded-full"></div>
        </div>
      </div>
    )
  };

  // Enhanced error modal with animation
  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative max-w-md w-full mx-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5C6A] to-[#F8C62B] opacity-20 blur rounded-xl"></div>
        <div className="relative bg-[#24262F] rounded-lg p-6 border border-[#FF5C6A]/20 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#FF5C6A]/20 flex items-center justify-center mr-2">
                <X className="h-4 w-4 text-[#FF5C6A]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Error</h3>
            </div>
            <button onClick={() => setShowErrorModal(false)} className="text-[#FFFFFF]/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-[#1A1D2A] p-4 rounded-lg mb-6">
            <p className="text-[#FFFFFF]/90 break-words">{errorMessage || "An unknown error occurred"}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-4 py-2 bg-[#FF5C6A] text-white rounded-lg hover:bg-[#FF5C6A]/90 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced success modal with animation and icon
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative max-w-md w-full mx-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#24E8AD] to-[#2A9BF6] opacity-20 blur rounded-xl"></div>
        <div className="relative bg-[#24262F] rounded-lg p-6 border border-[#24E8AD]/20 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#24E8AD]/20 flex items-center justify-center mr-2">
                <CheckCircle className="h-4 w-4 text-[#24E8AD]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Success!</h3>
            </div>
            <button onClick={handleSuccessModalClose} className="text-[#FFFFFF]/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6 text-center py-4">
            <div className="w-20 h-20 bg-[#24E8AD]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-[#24E8AD]" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Campaign Created!</h4>
            <p className="text-[#FFFFFF]/80">
              Your campaign has been created successfully and is now ready to connect with content creators.
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleSuccessModalClose}
              className="px-6 py-3 bg-gradient-to-r from-[#24E8AD] to-[#2A9BF6] text-white rounded-lg hover:shadow-lg hover:shadow-[#24E8AD]/20 transition-all font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1A1D2A] text-white">
      <ResponsiveHeader 
        navItems={navItems}
        logo={logo}
        showConnectButton={true}
        className={isScrolled ? "bg-[#1A1D2A]/95 backdrop-blur-md shadow-md" : "bg-transparent"}
      />
      
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {renderStepIndicator()}
          <div className="mt-8">
            {currentStep === "type" && renderTypeStep()}
            {currentStep === "link" && renderLinkStep()}
            {currentStep === "details" && renderDetailsStep()}
          </div>
        </div>
      </main>

      {showErrorModal && <ErrorModal />}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default CampaignPage;


