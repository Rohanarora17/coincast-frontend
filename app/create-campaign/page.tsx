'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Calendar, Tag, ChevronLeft, X, ExternalLink } from 'lucide-react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { getCoin } from "@zoralabs/coins-sdk";
import { base } from 'viem/chains';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Header } from '~~/components/Header';
import { Footer } from '~~/components/Footer';
import { ConnectWalletSection } from '~~/components/ConnectWalletSection';
import { formatEther } from 'viem';
import axios from 'axios';
import { useZoraProfile } from '~~/hooks/useZoraProfile';
import { useZoraBalances } from '~~/hooks/useZoraBalances';
import { useZoraRewards } from '~~/hooks/useZoraRewards';
import { useQuery } from '@tanstack/react-query';
import { useSplit } from '~~/hooks/useSplit';
import { Address } from 'viem';
import { useTokenVerification, CoinDetails } from '~~/hooks/useTokenVerification';
import { useClankerVerification, ClankerTokenDetails } from '~~/hooks/useClankerVerification';
import { useUpdatePayoutRecipient } from '~~/hooks/useUpdatePayoutRecipient';
import { useUpdateClankerPayoutRecipient } from '~~/hooks/useUpdateClankerPayoutRecipient';
import { useRouter } from 'next/navigation';

// Token types
type TokenType = 'zora' | 'clanker';

// LpLockerv2 contract address
const LP_LOCKER_CONTRACT = '0x33e2Eda238edcF470309b8c6D228986A1204c8f9' as Address;

const BASE_CHAIN_ID = 8453;

type Step = 'type' | 'link' | 'details';

const CampaignPage = () => {
  console.log('Campaign page rendering'); // Debug log

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { fetchProfile } = useZoraProfile();
  const { fetchAllBalances } = useZoraBalances();
  const { fetchRewards } = useZoraRewards();
  const { createProtocolSplit, isLoading: isSplitLoading, error: splitError } = useSplit();
  const { updatePayoutRecipient, isLoading: isUpdatingPayout, error: payoutError } = useUpdatePayoutRecipient();
  const { updatePayoutRecipient: updateClankerPayoutRecipient, isLoading: isUpdatingClankerPayout, error: clankerPayoutError } = useUpdateClankerPayoutRecipient();
  const chainId = useChainId();
  const { verifyToken, isVerifying, error: verificationError, coinDetails } = useTokenVerification();
  const { verifyToken: verifyClankerToken, isVerifying: isVerifyingClanker, error: clankerVerificationError, tokenDetails: clankerTokenDetails } = useClankerVerification();
  const router = useRouter();

  const [tokenType, setTokenType] = useState<TokenType>('zora');
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [zoraLink, setZoraLink] = useState('');
  const [clankerTokenAddress, setClankerTokenAddress] = useState('');
  const [budget, setBudget] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [keywords, setKeywords] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['zoraProfile', address],
    queryFn: () => fetchProfile(address),
    enabled: !!isConnected && !!address,
    staleTime: Infinity,
  });

  console.log('Profile:', profile);

  // Fetch user balances
  const { data: balances } = useQuery({
    queryKey: ['zoraBalances', address],
    queryFn: () => fetchAllBalances(address),
    enabled: !!isConnected && !!address,
    staleTime: Infinity,
  });

  console.log('Balances:', balances);

  // Fetch user rewards
  const { data: rewards } = useQuery({
    queryKey: ['zoraRewards', address],
    queryFn: () => fetchRewards(),
    enabled: !!isConnected && !!address,
    staleTime: Infinity,
  });

  console.log('Rewards:', rewards);

  // Calculate unclaimed rewards and convert to ETH
  const unclaimedRewards = useMemo(() => {
    if (!rewards?.protocolRewards) return BigInt(0);

    if (typeof rewards.protocolRewards === 'bigint') {
      return rewards.protocolRewards;
    }

    if (typeof rewards.protocolRewards === 'object' && rewards.protocolRewards.wei) {
      return BigInt(rewards.protocolRewards.wei);
    }

    if (typeof rewards.protocolRewards === 'string') {
      return BigInt(rewards.protocolRewards);
    }

    return BigInt(0);
  }, [rewards]);

  const availableEth = useMemo(() => Number(formatEther(unclaimedRewards)), [unclaimedRewards]);

  // Helper to extract token address from Zora link
  function extractTokenAddress(link: string): string | null {
    console.log('Extracting token address from:', link);
    
    const patterns = [
      /base:(0x[a-fA-F0-9]{40})/, // base:0x...
      /\/coin\/base:(0x[a-fA-F0-9]{40})/, // /coin/base:0x...
      /\/collect\/base:(0x[a-fA-F0-9]{40})/, // /collect/base:0x...
      /(0x[a-fA-F0-9]{40})/ // Just the address
    ];

    for (const pattern of patterns) {
      const match = link.match(pattern);
      if (match) {
        const address = match[1];
        console.log('Found token address:', address);
        return address;
      }
    }

    console.log('No token address found in link');
    return null;
  }

  // Add debug logging for token address
  useEffect(() => {
    if (zoraLink) {
      const address = extractTokenAddress(zoraLink);
      console.log('Current Zora link:', zoraLink);
      console.log('Extracted address:', address);
    }
  }, [zoraLink]);

  const handleSelectTokenType = (type: TokenType) => {
    setTokenType(type);
    setCurrentStep('link');
  };

  const handleVerifyLink = async () => {
    if (tokenType === 'zora') {
      if (!zoraLink) {
        setErrorMessage('Please enter a Zora link');
        setShowErrorModal(true);
        return;
      }

      const tokenAddress = extractTokenAddress(zoraLink);
      if (!tokenAddress || !address) {
        setErrorMessage('Invalid Zora link or wallet not connected');
        setShowErrorModal(true);
        return;
      }

      const formattedAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
      const isValid = await verifyToken(formattedAddress, address);

      if (isValid) {
        setCurrentStep('details');
      } else if (verificationError) {
        setErrorMessage(verificationError.message);
        setShowErrorModal(true);
      }
    } else {
      // Clanker verification
      if (!clankerTokenAddress) {
        setErrorMessage('Please enter a Clanker token address');
        setShowErrorModal(true);
        return;
      }

      if (!address) {
        setErrorMessage('Wallet not connected');
        setShowErrorModal(true);
        return;
      }

      const isValid = await verifyClankerToken(clankerTokenAddress, address);

      if (isValid) {
        setCurrentStep('details');
      } else if (clankerVerificationError) {
        setErrorMessage(clankerVerificationError.message);
        setShowErrorModal(true);
      }
    }
  };

  const handleCreateCampaign = async () => {
    if (!validateInputs()) {
      return;
    }
  
    setIsCreating(true);
    try {
      let splitAddress: Address | null = null;
  
      if (tokenType === 'zora') {
        const tokenAddress = extractTokenAddress(zoraLink);
        if (!tokenAddress) {
          throw new Error('Invalid Zora link: No token address found');
        }
  
        const formattedAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
        
        // Calculate budget percentage
        const budgetPercentage = (budget / availableEth) * 100;
        console.log('Calculated budget percentage:', budgetPercentage);
  
        // Create split contract
        splitAddress = await createProtocolSplit(budgetPercentage, formattedAddress as Address);
        if (!splitAddress) {
          throw new Error('Failed to create split contract');
        }
  
        console.log('Split created successfully, updating Zora payout recipient...', {
          coinAddress: formattedAddress,
          splitAddress,
        });
  
        // Update payout recipient to split address
        const success = await updatePayoutRecipient(formattedAddress as Address, splitAddress);
        console.log('Zora payout recipient update result:', { success, error: payoutError });
  
        if (!success) {
          throw new Error(`Failed to update Zora payout recipient: ${payoutError}`);
        }
  
        console.log('Zora payout recipient updated successfully', { success, splitAddress });
      } else {
        // Clanker flow
        if (!clankerTokenDetails) {
          throw new Error('Clanker token details not available');
        }
  
        // Calculate budget percentage
        const budgetPercentage = (budget / availableEth) * 100;
        console.log('Calculated budget percentage:', budgetPercentage);
  
        // Create split contract using the LP Locker contract address
        splitAddress = await createProtocolSplit(budgetPercentage, clankerTokenDetails.lpLockerAddress);
        if (!splitAddress) {
          throw new Error('Failed to create split contract');
        }
  
        console.log('Split created successfully, updating Clanker payout recipient...', {
          tokenId: clankerTokenDetails.id,
          lpLockerAddress: clankerTokenDetails.lpLockerAddress,
          splitAddress,
        });
  
        // Update Clanker payout recipient to split address
        const success = await updateClankerPayoutRecipient(
          clankerTokenDetails.id,
          clankerTokenDetails.lpLockerAddress,
          splitAddress
        );
        console.log('Clanker payout recipient update result:', { success, error: clankerPayoutError });
  
        if (!success) {
          throw new Error(`Failed to update Clanker payout recipient: ${clankerPayoutError}`);
        }
  
        console.log('Clanker payout recipient updated successfully', { success, splitAddress });
      }
  
      // Store campaign details
      const campaignDetails = {
        tokenType,
        zoraLink: tokenType === 'zora' ? zoraLink : undefined,
        clankerTokenAddress: tokenType === 'clanker' ? clankerTokenAddress : undefined,
        budget,
        startDate,
        endDate,
        keywords,
        splitAddress,
        budgetPercentage: (budget / availableEth) * 100,
      };
  
      console.log('Campaign creation completed successfully', campaignDetails);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error in campaign creation:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create campaign');
      setShowErrorModal(true);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  const validateInputs = () => {
    if (!budget || budget <= 0) {
      setErrorMessage('Please enter a valid budget');
      setShowErrorModal(true);
      return false;
    }

    if (!startDate || !endDate) {
      setErrorMessage('Please select start and end dates');
      setShowErrorModal(true);
      return false;
    }

    if (startDate >= endDate) {
      setErrorMessage('End date must be after start date');
      setShowErrorModal(true);
      return false;
    }

    if (keywords.length === 0) {
      setErrorMessage('Please enter at least one keyword');
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className={`flex items-center ${currentStep === 'type' ? 'text-indigo-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'type' ? 'border-indigo-600' : 'border-gray-400'}`}>
          1
        </div>
        <span className="ml-2">Select Token</span>
      </div>
      <div className="w-16 h-0.5 mx-4 bg-gray-200"></div>
      <div className={`flex items-center ${currentStep === 'link' ? 'text-indigo-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'link' ? 'border-indigo-600' : 'border-gray-400'}`}>
          2
        </div>
        <span className="ml-2">Verify Token</span>
      </div>
      <div className="w-16 h-0.5 mx-4 bg-gray-200"></div>
      <div className={`flex items-center ${currentStep === 'details' ? 'text-indigo-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 'details' ? 'border-indigo-600' : 'border-gray-400'}`}>
          3
        </div>
        <span className="ml-2">Campaign Details</span>
      </div>
    </div>
  );

  const renderTypeStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Token Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => handleSelectTokenType('zora')}
          className="border border-gray-200 p-6 rounded-lg cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Zora</h3>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <img 
                src="https://zora.co/favicon.ico" 
                alt="Zora" 
                className="w-8 h-8"
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm">Create a campaign for your Zora token using a link to your token page.</p>
        </div>
        
        <div 
          onClick={() => handleSelectTokenType('clanker')}
          className="border border-gray-200 p-6 rounded-lg cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Clanker</h3>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <img 
                src="https://clanker.world/clanker-logo.svg" 
                alt="Clanker" 
                className="w-8 h-8"
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm">Create a campaign for your Clanker token using your token address.</p>
        </div>
      </div>
    </div>
  );

  const renderLinkStep = () => {
    if (tokenType === 'zora') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Zora Post Link</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
              placeholder="https://zora.co/collect/base:0x..."
              value={zoraLink}
              onChange={(e) => setZoraLink(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Enter the link to your Zora post (e.g., https://zora.co/collect/base:0x...)</p>
          </div>

          {coinDetails && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{coinDetails.name}</h3>
                <span className="text-sm text-gray-700">{coinDetails.symbol}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Market Cap</p>
                  <p className="font-medium text-gray-900">
                    {(() => {
                      try {
                        const value = parseFloat(coinDetails.marketCap);
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(value);
                      } catch (error) {
                        console.error('Error formatting market cap:', error);
                        return '$0.00';
                      }
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">24h Volume</p>
                  <p className="font-medium text-gray-900">
                    {(() => {
                      try {
                        const value = parseFloat(coinDetails.volume24h);
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(value);
                      } catch (error) {
                        console.error('Error formatting volume:', error);
                        return '$0.00';
                      }
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                  <p className="font-medium text-gray-900">
                    {(() => {
                      try {
                        const value = parseFloat(coinDetails.totalVolume);
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(value);
                      } catch (error) {
                        console.error('Error formatting total volume:', error);
                        return '$0.00';
                      }
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unique Holders</p>
                  <p className="font-medium text-gray-900">{coinDetails.uniqueHolders}</p>
                </div>
              </div>

              {coinDetails.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{coinDetails.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Created: {coinDetails.createdAt ? new Date(coinDetails.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <a
                  href={`https://dexscreener.com/base/${coinDetails.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                >
                  View on DEXScreener
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('type')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleVerifyLink}
              disabled={isVerifying || !zoraLink}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center disabled:bg-indigo-400"
            >
              {isVerifying ? 'Verifying...' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      );
    } else {
      // Clanker token input
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Clanker Token Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
              placeholder="Enter token address (e.g., 0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb)"
              value={clankerTokenAddress}
              onChange={(e) => setClankerTokenAddress(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Enter your Clanker token address. This is the address of your token contract.</p>
          </div>

          {clankerTokenDetails && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Clanker Token #{clankerTokenDetails.id}
                </h3>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Token Address</p>
                <p className="font-medium text-gray-900 break-all">{clankerTokenDetails.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">LP Locker Address</p>
                <p className="font-medium text-gray-900 break-all">{clankerTokenDetails.lpLockerAddress}</p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <a
                  href={`https://basescan.org/address/${clankerTokenDetails.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                >
                  View Token on BaseScan
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('type')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleVerifyLink}
              disabled={isVerifyingClanker || !clankerTokenAddress}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center disabled:bg-indigo-400"
            >
              {isVerifyingClanker ? 'Verifying...' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      );
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2 font-medium">Budget Allocation (ETH)</label>
        <div className="space-y-6">
          {(() => {
            const decimalPlaces = availableEth < 0.01 ? 9 : 4;
            const percentages = [25, 50, 75];

            return (
              <>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      {percentages.map((percent) => (
                        <button
                          key={percent}
                          onClick={() => setBudget((availableEth * percent) / 100)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setBudget(availableEth)}
                      className="px-3 py-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="relative pt-6 pb-2">
                    <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                      <span>0 ETH</span>
                      <span>{availableEth.toFixed(decimalPlaces)} ETH</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={availableEth}
                      step={availableEth < 0.01 ? '0.0000001' : '0.0001'}
                      value={budget}
                      onChange={(e) => setBudget(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Available: {availableEth.toFixed(decimalPlaces)} ETH</span>
                  <span className="font-semibold text-indigo-600">{budget.toFixed(decimalPlaces)} ETH ({((budget / availableEth) * 100).toFixed(1)}%)</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Campaign Start Date</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
              <Calendar className="h-5 w-5" />
            </div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
              placeholderText="Select start date"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Campaign End Date</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
              <Calendar className="h-5 w-5" />
            </div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
              placeholderText="Select end date"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2 font-medium">
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1 text-gray-500" />
            Keywords
          </div>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 bg-white text-gray-900"
          placeholder="Enter keywords separated by commas (e.g., NFT, Web3, Digital Art, Metaverse)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">Add keywords to target users for reward distribution</p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('link')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleCreateCampaign}
          disabled={isCreating}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center disabled:bg-indigo-400"
        >
          {isCreating ? 'Creating...' : 'Create Campaign'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <div className="flex-1 px-4 py-6 md:py-10 max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="text-indigo-600 font-medium flex items-center mb-6 hover:text-indigo-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Create Marketing Campaign</h1>

        {renderStepIndicator()}

        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">Please connect your wallet to create a campaign</p>
            <ConnectWalletSection />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-5 md:p-8 mb-8">
            {currentStep === 'type' ? renderTypeStep() :
             currentStep === 'link' ? renderLinkStep() :
             renderDetailsStep()}
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-600">Error</h3>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-700 mb-6 break-words">{errorMessage || 'An unknown error occurred'}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-600">Success!</h3>
                <button
                  onClick={handleSuccessModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">Your campaign has been created successfully!</p>
              <div className="flex justify-end">
                <button
                  onClick={handleSuccessModalClose}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CampaignPage;