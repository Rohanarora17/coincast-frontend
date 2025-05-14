"use client";

import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { Footer } from "../components/Footer";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isConnected) {
      router.push('/create-campaign');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <HeroSection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Home;