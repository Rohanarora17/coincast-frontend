"use client";

import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { 
  ArrowRightIcon, 
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import ResponsiveHeader from "~~/components/Header";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header styling and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Update active section based on scroll position
      const sections = ["home", "problem", "solution", "benefits", "ecosystem", "faq"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isConnected) {
      router.push('/create-campaign');
    }
  };

  const handleViewBounties = () => {
    router.push('/view-campaigns');
  };

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1D2A] text-white">
      <ResponsiveHeader 
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
        navItems={[
          { id: "home", label: "Home", onClick: () => router.push("/") },
          { id: "dashboard", label: "Dashboard", onClick: () => router.push("/dashboard") },
          { id: "create", label: "Create Campaign", onClick: () => router.push("/create-campaign") },
          { id: "view-campaigns", label: "View Campaigns", onClick: () => router.push("/view-campaigns") },
        ]}
        activeSection="home"
      />
      
      <main>
        {/* Hero Section with Animated Background */}
        <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          {/* Animated Background */}
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
                    animation: `pulse 3s infinite ${Math.random() * 2}s`
                  }} 
                />
              ))}
              
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
                    opacity: 0.2 
                  }} 
                />
              ))}
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
            <div className="mb-6 flex space-x-2 items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F8C62B] text-[#1A1D2A]">
                NEW
              </span>
              <span className="text-sm text-[#F8C62B]">First DeFi platform for creators and tokens</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Cast Together,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6]">Thrive Forever</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#FFFFFF]/80 max-w-2xl mb-10">
              Coin Cast bridges token creators with content creators, sharing success through aligned incentives. When your community thrives, your tokens thrive.
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-10 w-full max-w-3xl">
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-[#F8C62B]">50+</span>
                <span className="text-sm text-[#FFFFFF]/70">Token Projects</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-[#2A9BF6]">10k+</span>
                <span className="text-sm text-[#FFFFFF]/70">Content Creators</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-[#24E8AD]">$2M+</span>
                <span className="text-sm text-[#FFFFFF]/70">Fees Distributed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-[#FF5C6A]">120k+</span>
                <span className="text-sm text-[#FFFFFF]/70">Community Members</span>
              </div>
            </div>
            
            {/* Action Buttons based on connection state */}
            {!isConnected ? (
              <div className="mt-4">
                <RainbowKitCustomConnectButton text="Get Started" />
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  <button 
                    onClick={handleGetStarted}
                    className="px-8 py-3 rounded-lg font-medium bg-[#7B3FEF] hover:bg-[#6A35D0] text-white transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    Create Campaign
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleViewBounties}
                    className="px-8 py-3 rounded-lg font-medium bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/15 border border-[#FFFFFF]/20 text-white transition-all flex items-center justify-center"
                  >
                    <SparklesIcon className="mr-2 h-5 w-5 text-[#F8C62B]" />
                    View Campaigns
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Scroll down indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
            <button onClick={() => scrollToSection("problem")} className="text-white/50 hover:text-white">
              <ChevronDownIcon className="h-6 w-6" />
            </button>
          </div>
        </section>

        {/* The rest of your sections remain the same */}
        {/* Problem Statement Section */}
        <section id="problem" className="py-20 bg-[#1A1D2A] relative overflow-hidden">
          {/* Background wave effect */}
          <div className="absolute inset-0 z-0">
            {[...Array(5)].map((_, i) => (
              <div 
                key={`wave-${i}`}
                className="absolute w-full h-8" 
                style={{ 
                  top: `${15 + i * 15}%`, 
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#7B3FEF' : '#2A9BF6'}, transparent)`, 
                  opacity: 0.05, 
                  transform: `skewY(${2 - i}deg)` 
                }} 
              />
            ))}
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">The Problem</h2>
                <div className="bg-[#FFFFFF]/5 rounded-lg p-6 border border-[#FFFFFF]/10 shadow-xl">
                  <h3 className="text-xl font-medium mb-4 text-[#FF5C6A]">Token Projects Lose Momentum</h3>
                  <p className="text-[#FFFFFF]/80 mb-4">
                    Token launchpads like Clanker allow creators to launch ERC-20 tokens, but many tokens lose momentum after launch due to:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF5C6A]/20 text-[#FF5C6A] mr-2 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>Lack of ongoing promotion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF5C6A]/20 text-[#FF5C6A] mr-2 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>Insufficient community engagement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FF5C6A]/20 text-[#FF5C6A] mr-2 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>No mechanisms to reward loyal supporters</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#FFFFFF]/5 rounded-lg p-6 border border-[#FFFFFF]/10 shadow-xl mt-6">
                  <h3 className="text-xl font-medium mb-4 text-[#2A9BF6]">Creators Lack Incentives</h3>
                  <p className="text-[#FFFFFF]/80 mb-4">
                    Micro-creators on platforms like Zora and Farcaster produce content but:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>No connection to parent tokens</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>No rewards for promotion efforts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>Limited monetization opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="relative z-10 bg-[#24262F] rounded-lg overflow-hidden shadow-xl border border-[#FFFFFF]/10">
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-[#1A1D2A] rounded-full flex items-center justify-center mr-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F8C62B] to-[#FF5C6A] opacity-60 animate-pulse"></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">The Missing Link</h3>
                          <p className="text-[#FFFFFF]/60 text-sm">Disconnect between tokens and content</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#1A1D2A] rounded-lg">
                          <span className="text-sm">Token Creator</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#F8C62B]/20 text-[#F8C62B]">No Promotion</span>
                        </div>
                        
                        <div className="relative h-16 flex items-center justify-center">
                          <div className="absolute top-1/2 w-full border-t border-dashed border-[#FFFFFF]/20"></div>
                          <div className="absolute w-8 h-8 rounded-full bg-[#FFFFFF]/5 flex items-center justify-center border border-[#FFFFFF]/20">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-[#1A1D2A] rounded-lg">
                          <span className="text-sm">Content Creator</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6]">No Rewards</span>
                        </div>
                        
                        <div className="relative h-16 flex items-center justify-center">
                          <div className="absolute top-1/2 w-full border-t border-dashed border-[#FFFFFF]/20"></div>
                          <div className="absolute w-8 h-8 rounded-full bg-[#FFFFFF]/5 flex items-center justify-center border border-[#FFFFFF]/20">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-[#1A1D2A] rounded-lg">
                          <span className="text-sm">Token Value</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#FF5C6A]/20 text-[#FF5C6A]">Declines</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#7B3FEF]/10 blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#2A9BF6]/10 blur-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

       

        {/* Solution Section */}
        <section id="solution" className="py-20 bg-gradient-to-b from-[#1A1D2A] to-[#24262F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solution</h2>
              <p className="text-[#FFFFFF]/80 max-w-2xl mx-auto">
                Coin Cast bridges the gap between token creators and content creators, enabling a thriving ecosystem of aligned incentives and shared success.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 space-y-12 md:space-y-0">
              <div className="w-full md:w-1/2 max-w-md">
                <div className="relative z-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FEF] to-[#2A9BF6] rounded-lg blur opacity-25"></div>
                  <div className="relative bg-[#24262F] rounded-lg shadow-xl p-6 border border-[#FFFFFF]/10">
                    <div className="mb-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#7B3FEF] text-white font-bold text-lg mb-4">1</span>
                      <h3 className="text-xl font-bold mb-2">Linking Tokens</h3>
                      <p className="text-[#FFFFFF]/70">
                        Connect Clanker's parent ERC-20 tokens to Zora's child ERC-20 Zora Coins and Farcaster content.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#1A1D2A] rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#F8C62B] flex items-center justify-center text-[#1A1D2A] font-bold mr-2">P</div>
                        <span>Parent Token (Clanker)</span>
                      </div>
                      
                      <div className="relative h-16 flex justify-center">
                        <div className="h-full w-0.5 bg-gradient-to-b from-[#F8C62B] to-[#24E8AD]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#7B3FEF] flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#24E8AD] flex items-center justify-center text-[#1A1D2A] font-bold mr-2">C</div>
                        <span>Child Tokens (Zora)</span>
                      </div>
                      
                      <div className="text-xs text-[#FFFFFF]/50 mt-2 italic">
                        Creating a unified network for supporters
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#F8C62B] to-[#24E8AD] rounded-lg blur opacity-25"></div>
                  <div className="relative bg-[#24262F] rounded-lg shadow-xl p-6 border border-[#FFFFFF]/10">
                    <div className="mb-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F8C62B] text-white font-bold text-lg mb-4">2</span>
                      <h3 className="text-xl font-bold mb-2">Fee Sharing</h3>
                      <p className="text-[#FFFFFF]/70">
                        Parent token creators share trade or LP fees with micro-creators based on engagement metrics.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#1A1D2A] rounded-lg">
                      <div className="mb-3">
                        <div className="w-full h-2 bg-[#FFFFFF]/10 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-[#7B3FEF]"></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs">
                          <span>Token Creator: 75%</span>
                          <span>Creators: 25%</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap -mx-1 mt-4">
                        <div className="px-1 w-1/2 mb-2">
                          <div className="p-2 bg-[#FFFFFF]/5 rounded-md text-xs">
                            <span className="block text-[#F8C62B]">Mints</span>
                            <span className="text-[#FFFFFF]/70">+5% Fees</span>
                          </div>
                        </div>
                        <div className="px-1 w-1/2 mb-2">
                          <div className="p-2 bg-[#FFFFFF]/5 rounded-md text-xs">
                            <span className="block text-[#2A9BF6]">Trades</span>
                            <span className="text-[#FFFFFF]/70">+10% Fees</span>
                          </div>
                        </div>
                        <div className="px-1 w-1/2 mb-2">
                          <div className="p-2 bg-[#FFFFFF]/5 rounded-md text-xs">
                            <span className="block text-[#FF5C6A]">Likes</span>
                            <span className="text-[#FFFFFF]/70">+5% Fees</span>
                          </div>
                        </div>
                        <div className="px-1 w-1/2 mb-2">
                          <div className="p-2 bg-[#FFFFFF]/5 rounded-md text-xs">
                            <span className="block text-[#24E8AD]">Recasts</span>
                            <span className="text-[#FFFFFF]/70">+5% Fees</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 max-w-md">
                <div className="relative z-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#2A9BF6] to-[#24E8AD] rounded-lg blur opacity-25"></div>
                  <div className="relative bg-[#24262F] rounded-lg shadow-xl p-6 border border-[#FFFFFF]/10">
                    <div className="mb-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#2A9BF6] text-white font-bold text-lg mb-4">3</span>
                      <h3 className="text-xl font-bold mb-2">Cross-Platform Incentives</h3>
                      <p className="text-[#FFFFFF]/70">
                        Micro-creators and supporters earn from parent token fees, creating new revenue streams.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#1A1D2A] rounded-lg">
                      <div className="relative pt-4">
                        <div className="flex justify-center mb-6">
                          <div className="w-12 h-12 rounded-full bg-[#F8C62B]/20 flex items-center justify-center border-2 border-[#F8C62B]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 17L12 22L22 17" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 12L12 17L22 12" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mb-4">
                          <div>
                            <div className="w-10 h-10 rounded-full bg-[#2A9BF6]/20 flex items-center justify-center border-2 border-[#2A9BF6]">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 9V5C14 3.89543 13.1046 3 12 3H5C3.89543 3 3 3.89543 3 5V9C3 10.1046 3.89543 11 5 11H12C13.1046 11 14 10.1046 14 9Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 19V15C14 13.8954 13.1046 13 12 13H5C3.89543 13 3 13.8954 3 15V19C3 20.1046 3.89543 21 5 21H12C13.1046 21 14 20.1046 14 19Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 9V5C21 3.89543 20.1046 3 19 3H17C15.8954 3 15 3.89543 15 5V9C15 10.1046 15.8954 11 17 11H19C20.1046 11 21 10.1046 21 9Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 19V15C21 13.8954 20.1046 13 19 13H17C15.8954 13 15 13.8954 15 15V19C15 20.1046 15.8954 21 17 21H19C20.1046 21 21 20.1046 21 19Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className="block text-xs mt-1 text-center">Zora</span>
                          </div>
                          
                          <div>
                            <div className="w-10 h-10 rounded-full bg-[#24E8AD]/20 flex items-center justify-center border-2 border-[#24E8AD]">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3C16.982 3 21 7.018 21 12C21 16.982 16.982 21 12 21C7.018 21 3 16.982 3 12C3 7.018 7.018 3 12 3ZM12 5C8.134 5 5 8.134 5 12C5 15.866 8.134 19 12 19C15.866 19 19 15.866 19 12C19 8.134 15.866 5 12 5ZM9.414 11H6.586L12 5.586L17.414 11H14.586L12 8.414L9.414 11ZM6.586 13H9.414L12 15.586L14.586 13H17.414L12 18.414L6.586 13Z" fill="#24E8AD"/>
                              </svg>
                            </div>
                            <span className="block text-xs mt-1 text-center">Farcaster</span>
                          </div>
                        </div>
                        
                        <div className="text-center text-xs mb-2">
                          <span className="inline-block px-2 py-1 bg-[#7B3FEF]/20 text-[#7B3FEF] rounded-full">
                            Fee Revenue Streams
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#24E8AD]">
                            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        
                        <div className="flex mt-3 justify-center">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-[#7B3FEF] flex items-center justify-center mx-auto">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className="block text-xs mt-1">Content Creators</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FEF] to-[#FF5C6A] rounded-lg blur opacity-25"></div>
                  <div className="relative bg-[#24262F] rounded-lg shadow-xl p-6 border border-[#FFFFFF]/10">
                    <div className="mb-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FF5C6A] text-white font-bold text-lg mb-4">4</span>
                      <h3 className="text-xl font-bold mb-2">Zora Integration</h3>
                      <p className="text-[#FFFFFF]/70">
                        Seamless integration with Zora's ERC-20 Zora Coins for a liquid, community-focused ecosystem.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#1A1D2A] rounded-lg">
                      <div className="flex justify-between items-center mb-4 p-2 bg-[#FFFFFF]/5 rounded-lg">
                        <span className="text-sm">Instantly Tradable</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#24E8AD]/20 text-[#24E8AD]">Liquidity</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4 p-2 bg-[#FFFFFF]/5 rounded-lg">
                        <span className="text-sm">Paired with $ZORA / $USDC</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F8C62B]/20 text-[#F8C62B]">Trading</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-[#FFFFFF]/5 rounded-lg">
                        <span className="text-sm">Fee Distribution</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#7B3FEF]/20 text-[#7B3FEF]">Rewards</span>
                      </div>
                      
                      <div className="flex justify-center mt-4">
                        <span className="text-xs text-[#FFFFFF]/60 italic">Creating a thriving ecosystem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-[#24262F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits For Everyone</h2>
              <p className="text-[#FFFFFF]/80 max-w-2xl mx-auto">
                Coin Cast creates a win-win ecosystem where all participants benefit from aligned incentives and collaborative growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Token Creator Benefits */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#F8C62B] to-[#7B3FEF] rounded-lg blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative h-full bg-[#1A1D2A] rounded-lg p-6 border border-[#FFFFFF]/10 shadow-xl">
                  <div className="w-14 h-14 rounded-full bg-[#F8C62B]/20 border-2 border-[#F8C62B] flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">For Token Creators</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Sustainable community-driven growth</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Automatic promotion by incentivized creators</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Stronger token liquidity and trading volume</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Long-term token value preservation</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <span className="text-sm text-[#F8C62B] block mb-2">Turn Supporters Into Partners</span>
                    <button 
                      onClick={handleGetStarted} 
                      className="w-full py-2 bg-[#F8C62B] hover:bg-[#E9B725] text-[#1A1D2A] font-medium rounded-lg transition-colors"
                    >
                      Launch Token
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content Creator Benefits */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#2A9BF6] to-[#24E8AD] rounded-lg blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative h-full bg-[#1A1D2A] rounded-lg p-6 border border-[#FFFFFF]/10 shadow-xl">
                  <div className="w-14 h-14 rounded-full bg-[#2A9BF6]/20 border-2 border-[#2A9BF6] flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 7H7V16H10V7Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 7H14V12H17V7Z" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">For Content Creators</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Earn from fee sharing based on promotion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Create content for projects you believe in</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>New monetization streams beyond ads or tips</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Grow your audience through project communities</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <span className="text-sm text-[#2A9BF6] block mb-2">Create Content, Capture Value</span>
                    <button 
                      onClick={handleGetStarted} 
                      className="w-full py-2 bg-[#2A9BF6] hover:bg-[#228DE1] text-white font-medium rounded-lg transition-colors"
                    >
                      Start Creating
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Community Benefits */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#7B3FEF] to-[#FF5C6A] rounded-lg blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative h-full bg-[#1A1D2A] rounded-lg p-6 border border-[#FFFFFF]/10 shadow-xl">
                  <div className="w-14 h-14 rounded-full bg-[#7B3FEF]/20 border-2 border-[#7B3FEF] flex items-center justify-center mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#7B3FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#7B3FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#7B3FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#7B3FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">For Community</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7B3FEF]/20 text-[#7B3FEF] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Rewards for supporting favorite projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7B3FEF]/20 text-[#7B3FEF] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Participate in token success through engagement</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7B3FEF]/20 text-[#7B3FEF] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Discover quality tokens with active creators</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7B3FEF]/20 text-[#7B3FEF] mr-2 mt-0.5">
                        <CheckCircleIcon className="h-3 w-3" />
                      </span>
                      <span>Join vibrant communities with aligned incentives</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <span className="text-sm text-[#7B3FEF] block mb-2">Your Support, Now Rewarded</span>
                    <button 
                      onClick={handleGetStarted} 
                      className="w-full py-2 bg-[#7B3FEF] hover:bg-[#6A35D0] text-white font-medium rounded-lg transition-colors"
                    >
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Partners Section */}
        <section id="ecosystem" className="py-20 bg-gradient-to-b from-[#24262F] to-[#1A1D2A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unified Ecosystem</h2>
              <p className="text-[#FFFFFF]/80 max-w-2xl mx-auto">
                Coin Cast seamlessly integrates with leading platforms to create a cohesive experience for all participants.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#FFFFFF]/5 rounded-lg p-6 border border-[#FFFFFF]/10 text-center flex flex-col items-center transition-all hover:bg-[#FFFFFF]/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#24262F] to-[#1A1D2A] p-1 mb-4 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#F8C62B]/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.16797 18.849C6.41863 18.0252 6.92144 17.3032 7.61557 16.7931C8.30969 16.283 9.1526 16.0088 10.018 16H13.982C14.8474 16.0088 15.6903 16.283 16.3844 16.7931C17.0786 17.3032 17.5814 18.0252 17.832 18.849" stroke="#F8C62B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Clanker</h3>
                <p className="text-[#FFFFFF]/70 text-sm mb-4">Parent Token Launchpad</p>
                <ul className="text-left text-sm space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>ERC-20 Token Creation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>LP Locker v2 Integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F8C62B]/20 text-[#F8C62B] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>Fee Sharing Capabilities</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#FFFFFF]/5 rounded-lg p-6 border border-[#FFFFFF]/10 text-center flex flex-col items-center transition-all hover:bg-[#FFFFFF]/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#24262F] to-[#1A1D2A] p-1 mb-4 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#2A9BF6]/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 9H20M4 15H20M10 3V21M14 3V21" stroke="#2A9BF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Zora</h3>
                <p className="text-[#FFFFFF]/70 text-sm mb-4">Content & Child Token Platform</p>
                <ul className="text-left text-sm space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>ERC-20 Zora Coins</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>Content Publishing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2A9BF6]/20 text-[#2A9BF6] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>Instant Tradability with $ZORA</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#FFFFFF]/5 rounded-lg p-6 border border-[#FFFFFF]/10 text-center flex flex-col items-center transition-all hover:bg-[#FFFFFF]/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#24262F] to-[#1A1D2A] p-1 mb-4 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#24E8AD]/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3C16.982 3 21 7.018 21 12C21 16.982 16.982 21 12 21C7.018 21 3 16.982 3 12C3 7.018 7.018 3 12 3ZM12 5C8.134 5 5 8.134 5 12C5 15.866 8.134 19 12 19C15.866 19 19 15.866 19 12C19 8.134 15.866 5 12 5ZM9.414 11H6.586L12 5.586L17.414 11H14.586L12 8.414L9.414 11ZM6.586 13H9.414L12 15.586L14.586 13H17.414L12 18.414L6.586 13Z" fill="#24E8AD"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Farcaster</h3>
                <p className="text-[#FFFFFF]/70 text-sm mb-4">Social Content & Distribution</p>
                <ul className="text-left text-sm space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#24E8AD]/20 text-[#24E8AD] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>Social Engagement Metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#24E8AD]/20 text-[#24E8AD] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>Content Distribution Network</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#24E8AD]/20 text-[#24E8AD] mr-2 mt-0.5">
                      <CheckCircleIcon className="h-2 w-2" />
                    </span>
                    <span>Cast & Recast Tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-[#1A1D2A]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-[#FFFFFF]/80">
                Everything you need to know about Coin Cast and how it works.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
                <h3 className="text-xl font-bold mb-2">How does fee sharing work?</h3>
                <p className="text-[#FFFFFF]/80">
                  Parent token creators can allocate a percentage of their trading fees (from Uniswap V3 pools) or LP fees to be distributed among content creators. The distribution is based on engagement metrics like mints, trades, likes, and recasts on Zora and Farcaster platforms.
                </p>
              </div>
              
              <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
                <h3 className="text-xl font-bold mb-2">What tokens are supported?</h3>
                <p className="text-[#FFFFFF]/80">
                  Coin Cast supports ERC-20 tokens launched on Clanker as parent tokens and integrates with Zora's ERC-20 Zora Coins as child tokens. The platform is designed to work with the Base network and is compatible with Uniswap V3 pools for fee distribution.
                </p>
              </div>
              
              <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
                <h3 className="text-xl font-bold mb-2">How do content creators get rewarded?</h3>
                <p className="text-[#FFFFFF]/80">
                  Content creators are rewarded based on their promotion efforts and engagement metrics. When they create content related to parent tokens, they earn a share of the fees generated by those tokens. Rewards are distributed automatically based on predetermined metrics like mints, trades, likes, and recasts.
                </p>
              </div>
              
              <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
                <h3 className="text-xl font-bold mb-2">Is there a minimum token amount required?</h3>
                <p className="text-[#FFFFFF]/80">
                  There is no minimum token amount required to participate. Token creators can decide what percentage of fees they want to share, and content creators can start promoting tokens regardless of their holdings. This allows for inclusive participation across the ecosystem.
                </p>
              </div>
              
              <div className="bg-[#24262F] rounded-lg p-6 border border-[#FFFFFF]/10">
                <h3 className="text-xl font-bold mb-2">How is Coin Cast different from other platforms?</h3>
                <p className="text-[#FFFFFF]/80">
                  Coin Cast is unique in creating a direct connection between token projects and content creators through fee sharing. Unlike other platforms that focus solely on token launches or content creation, Coin Cast bridges these ecosystems to create aligned incentives where everyone benefits from the success of token projects.
                </p>
              </div>
            </div>
            
            {/* Simple CTA directly in the FAQ section - replacing the previous standalone CTA */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to start your journey?</h3>
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 rounded-lg font-medium bg-[#7B3FEF] hover:bg-[#6A35D0] text-white transition-all transform hover:scale-105"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1D2A] border-t border-[#FFFFFF]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-[#7B3FEF] flex items-center justify-center">
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#F8C62B] rounded-full"></div>
                </div>
              </div>
              <span className="ml-2 text-xl font-bold tracking-tight">COIN CAST</span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 mb-6 md:mb-0">
              <button onClick={() => scrollToSection("home")} className="text-sm text-[#FFFFFF]/70 hover:text-[#2A9BF6] transition-colors">Home</button>
              <button onClick={() => scrollToSection("problem")} className="text-sm text-[#FFFFFF]/70 hover:text-[#2A9BF6] transition-colors">Problem</button>
              <button onClick={() => scrollToSection("solution")} className="text-sm text-[#FFFFFF]/70 hover:text-[#2A9BF6] transition-colors">Solution</button>
              <button onClick={() => scrollToSection("benefits")} className="text-sm text-[#FFFFFF]/70 hover:text-[#2A9BF6] transition-colors">Benefits</button>
              <button onClick={() => scrollToSection("ecosystem")} className="text-sm text-[#FFFFFF]/70 hover:text-[#2A9BF6] transition-colors">Ecosystem</button>
              <button onClick={() => scrollToSection("faq")} className="text-sm text-[#FFFFFF]/70 hover:text-[#2A9BF6] transition-colors">FAQ</button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-[#FFFFFF]/10">
            <div className="text-sm text-[#FFFFFF]/50 mb-4 md:mb-0">
              © 2025 Coin Cast. All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFFFF]/5 flex items-center justify-center hover:bg-[#FFFFFF]/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.01006C22.0424 3.68553 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 22.6608 4.40277 23 3.01006Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFFFF]/5 flex items-center justify-center hover:bg-[#FFFFFF]/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFFFF]/5 flex items-center justify-center hover:bg-[#FFFFFF]/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#FFFFFF]/5 flex items-center justify-center hover:bg-[#FFFFFF]/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80387 19.1414 5.03589C17.3731 3.26816 14.9022 2.17787 12.1768 2.17787C12.1177 2.17787 12.0586 2.17853 12 2.17982V2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" fill="currentColor"/>
                  <path d="M10.5 8L15.5 12L10.5 16V8Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes for floating elements */}
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

export default Home;