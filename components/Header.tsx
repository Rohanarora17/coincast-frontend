"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "./scaffold-eth/RainbowKitCustomConnectButton";
import { useAccount } from "wagmi";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  onClick: () => void;
}

interface ResponsiveHeaderProps {
  logo?: {
    text: string;
    icon?: React.ReactNode;
  };
  className?: string;
  showConnectButton?: boolean;
  navItems?: NavItem[];
  activeSection?: string;
}

const ResponsiveHeader = ({ 
  logo = { text: "COIN CAST" },
  className = "",
  showConnectButton = true,
  navItems = [],
  activeSection = ""
}: ResponsiveHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1A1D2A]/95 backdrop-blur-md shadow-md" : "bg-transparent"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          {logo.icon || (
            <div className="w-10 h-10 rounded-full bg-[#7B3FEF] flex items-center justify-center">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#F8C62B] rounded-full"></div>
              </div>
            </div>
          )}
          <span className="ml-2 text-xl font-bold tracking-tight text-white">{logo.text}</span>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id ? "text-[#7B3FEF]" : "text-white hover:text-[#2A9BF6]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Connect Button and Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {showConnectButton && (
            <div className="hidden md:block">
              <RainbowKitCustomConnectButton text="Connect Wallet" />
            </div>
          )}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#606677]/20 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A1D2A] px-4 py-4 absolute top-16 left-0 right-0 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsMenuOpen(false);
                }}
                className={`text-sm font-medium text-left transition-colors ${
                  activeSection === item.id ? "text-[#7B3FEF]" : "text-white hover:text-[#2A9BF6]"
                }`}
              >
                {item.label}
              </button>
            ))}
            {showConnectButton && (
              <div className="pt-2 border-t border-[#FFFFFF]/10">
                <RainbowKitCustomConnectButton text="Connect Wallet" />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default ResponsiveHeader;